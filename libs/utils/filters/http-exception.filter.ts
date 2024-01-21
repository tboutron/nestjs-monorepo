import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ILoggerService } from 'libs/modules/global/logger/adapter';
import { DateTime } from 'luxon';

import { AppApiException, ErrorModel } from '../exception';
import * as errorStatus from '../static/htttp-status.json';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: ILoggerService) {}

  catch(exception: AppApiException, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : [exception['status'], HttpStatus.INTERNAL_SERVER_ERROR].find(Boolean);

    exception.traceId = [exception.traceId, request['id']].find(Boolean);

    this.loggerService.error(exception, exception.message, exception.context);

    const result: ErrorModel = {
      error: {
        code: status,
        traceId: exception.traceId,
        message: [errorStatus[String(status)], exception.message].find(Boolean),
        timestamp: DateTime.fromJSDate(new Date()).setZone(process.env.TZ).toFormat('dd/MM/yyyy HH:mm:ss'),
        path: request.url,
      },
    };
    response.status(status).json(result);
  }
}
