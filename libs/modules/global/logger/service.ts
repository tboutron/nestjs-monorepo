import { IncomingMessage, ServerResponse } from 'node:http';
import { Transform } from 'node:stream';

import { Injectable, InternalServerErrorException, Scope } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { gray, green, isColorSupported, red, yellow } from 'colorette';
import { PinoRequestConverter } from 'convert-pino-request-to-curl';
import { AppApiException } from 'libs/utils';
import { DateTime } from 'luxon';
import { LevelWithSilent, Logger, multistream, pino } from 'pino';
import { HttpLogger, Options, pinoHttp } from 'pino-http';
import pinoPretty, { PrettyOptions } from 'pino-pretty';
import { v4 as uuidv4 } from 'uuid';

import { ILoggerService } from './adapter';
import { ErrorType, MessageType } from './type';

// eslint-disable-next-line @typescript-eslint/no-var-requires,unicorn/prefer-module
const pinoElastic = require('pino-elasticsearch');

@Injectable({ scope: Scope.REQUEST })
export class LoggerService implements ILoggerService {
  pino: HttpLogger;
  private app: string;
  private streamToElastic: Transform;

  constructor(private readonly elkUrl: string) {
    const index = `monorepo-logs-${this.getDateFormat(new Date(), 'yyyy-MM')}`;

    this.streamToElastic = pinoElastic({
      index,
      node: this.elkUrl,
      esVersion: 7,
      flushBytes: 1000,
    });
  }

  connect<T = LevelWithSilent>(logLevel: T): void {
    const pinoLogger = pino(
      {
        // useLevelLabels: true,
        level: [logLevel, 'trace'].find(Boolean).toString(),
      },
      multistream([
        {
          level: 'trace',
          stream: pinoPretty(this.getPinoConfig()),
        },
        { level: 'info', stream: this.streamToElastic },
      ]),
    );

    this.pino = pinoHttp(this.getPinoHttpConfig(pinoLogger));
  }

  setApplication(app: string): void {
    this.app = app;
  }

  log(message: string): void {
    this.pino.logger.trace(green(message));
  }

  trace({ message, context, obj = {} }: MessageType): void {
    Object.assign(obj, { context });
    this.pino.logger.trace([obj, gray(message)].find(Boolean), gray(message));
  }

  info({ message, context, obj = {} }: MessageType): void {
    Object.assign(obj, { context });
    this.pino.logger.info([obj, green(message)].find(Boolean), green(message));
  }

  warn({ message, context, obj = {} }: MessageType): void {
    Object.assign(obj, { context });
    this.pino.logger.warn([obj, yellow(message)].find(Boolean), yellow(message));
  }

  error(error: ErrorType, message?: string, context?: string): void {
    const errorResponse = this.getErrorResponse(error);

    const response =
      error?.name === AppApiException.name
        ? { statusCode: error['statusCode'], message: error?.message }
        : errorResponse?.value();

    const type = {
      Error: AppApiException.name,
    }[error?.name];

    this.pino.logger.error(
      {
        ...response,
        context: [context, this.app].find(Boolean),
        type: [type, error?.name].find(Boolean),
        traceId: this.getTraceId(error),
        timestamp: this.getDateFormat(),
        application: this.app,
        stack: error.stack,
      },
      red(message),
    );
  }

  fatal(error: ErrorType, message?: string, context?: string): void {
    this.pino.logger.fatal(
      {
        ...(error instanceof RpcException ? {} : (error.getResponse() as object)),
        context: [context, this.app].find(Boolean),
        type: error.name,
        traceId: this.getTraceId(error),
        timestamp: this.getDateFormat(),
        application: this.app,
        stack: error.stack,
      },
      red(message),
    );
  }

  private getPinoConfig(): PrettyOptions {
    return {
      colorize: isColorSupported,
      levelFirst: true,
      ignore: 'pid,hostname',
      // quietReqLogger: true,
      messageFormat: (log: unknown, messageKey: string) => {
        const message = log[String(messageKey)];
        if (this.app) {
          return `[${this.app}] ${message}`;
        }

        return message;
      },
      customPrettifiers: {
        time: () => {
          return `[${this.getDateFormat()}]`;
        },
      },
    };
  }

  private getPinoHttpConfig(pinoLogger: Logger): Options {
    return {
      logger: pinoLogger,
      quietReqLogger: true,
      customSuccessMessage: (req: IncomingMessage, res: ServerResponse) => {
        return `request ${res.statusCode >= 400 ? red('errro') : green('success')} with status code: ${res.statusCode}`;
      },
      customErrorMessage: (req: IncomingMessage, res: ServerResponse, error: Error) => {
        return `request ${red(error.name)} with status code: ${res.statusCode} `;
      },
      genReqId: (req: IncomingMessage) => {
        return req.headers.traceId;
      },
      customAttributeKeys: {
        req: 'request',
        res: 'response',
        err: 'error',
        responseTime: 'timeTaken',
        reqId: 'traceId',
      },
      serializers: {
        err: () => false,
        req: (request) => {
          return {
            method: request.method,
            curl: PinoRequestConverter.getCurl(request),
          };
        },
        res: pino.stdSerializers.res,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      customProps: (req: any): any => {
        const context = req.context;

        const traceId = [req?.headers?.traceId, req.id].find(Boolean);

        const path = `${req.protocol}://${req.headers.host}${req.url}`;

        this.pino.logger.setBindings({
          traceId,
          application: this.app,
          context: context,
          path,
          timestamp: this.getDateFormat(),
        });

        return {
          traceId,
          application: this.app,
          context: context,
          path,
          timestamp: this.getDateFormat(),
        };
      },
      customLogLevel: (req: IncomingMessage, res: ServerResponse, error: Error) => {
        if ([res.statusCode >= 400, error].some(Boolean)) {
          return 'error';
        }

        if ([res.statusCode >= 300, res.statusCode <= 400].every(Boolean)) {
          return 'silent';
        }

        return 'info';
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getErrorResponse(error: ErrorType): any {
    if (error instanceof RpcException) return;

    const isFunction = typeof error?.getResponse === 'function';
    return [
      {
        conditional: typeof error === 'string',
        value: () => new InternalServerErrorException(error).getResponse(),
      },
      {
        conditional: isFunction && typeof error.getResponse() === 'string',
        value: () =>
          new AppApiException(
            error.getResponse(),
            [error.getStatus(), error['status']].find(Boolean),
            error['context'],
          ).getResponse(),
      },
      {
        conditional: isFunction && typeof error.getResponse() === 'object',
        value: () => error?.getResponse(),
      },
      {
        conditional: [error?.name === Error.name, error?.name == TypeError.name].some(Boolean),
        value: () => new InternalServerErrorException(error.message).getResponse(),
      },
    ].find((c) => c.conditional);
  }

  private getDateFormat(date = new Date(), format = 'dd/MM/yyyy HH:mm:ss'): string {
    return DateTime.fromJSDate(date).setZone(process.env.TZ).toFormat(format);
  }

  private getTraceId(error): string {
    if (typeof error === 'string') return uuidv4();
    return [error.traceId, this.pino.logger.bindings()?.tranceId].find(Boolean);
  }
}
