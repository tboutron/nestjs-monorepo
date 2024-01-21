import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { initTracer, JaegerTracer, TracingConfig, TracingOptions } from 'jaeger-client';
import { ILoggerService } from 'libs/modules/global/logger/adapter';
import { TracingType } from 'libs/utils';
import { FORMAT_HTTP_HEADERS, Span, SpanOptions, Tags } from 'opentracing';
import { Observable, tap } from 'rxjs';

type Serializable = string | number | boolean | null | { [key: string]: Serializable };
export type BasicTracingData = {
  path: string;
  body: Serializable;
};

@Injectable()
export abstract class TracingInterceptor implements NestInterceptor {
  protected tracer: JaegerTracer;
  protected app: string;

  constructor({ app, version }: { app: string; version: string }, logger: ILoggerService) {
    this.app = app;

    const config: TracingConfig = {
      serviceName: app,
      sampler: {
        type: 'const',
        param: 1,
      },
    };

    const options: TracingOptions = this.getTracingLogger(logger);

    options.tags = {
      version: version,
      app: app,
    };

    this.tracer = initTracer(config, options);
  }

  intercept(executionContext: ExecutionContext, next: CallHandler): Observable<unknown> {
    const context = `${executionContext.getClass().name}/${executionContext.getHandler().name}`;
    const span = this.buildSpan(executionContext);
    const traceId = this.getTraceId(executionContext);

    const createJaegerInstance = (): TracingType => {
      return {
        span: span,
        tracer: this.tracer,
        tags: Tags,
        axios: (options: AxiosRequestConfig = {}) => {
          const headers = {};
          this.tracer.inject(span, FORMAT_HTTP_HEADERS, headers);
          options.headers = { ...options.headers, ...headers, traceId };

          return axios.create(options);
        },
        log: (eventName, payload) => {
          span.logEvent(eventName, payload);
        },
        setTag: (key, value) => {
          span.setTag(key, value);
        },
        addTags: (object) => {
          span.addTags(object);
        },
        setTracingTag: (key, value) => {
          span.setTag(key, value);
        },
        finish: () => {
          span.finish();
        },
        createSpan: (name, parent: Span) => {
          const parentObject: SpanOptions = parent ? { childOf: parent } : { childOf: span };
          return this.tracer.startSpan(name, parentObject);
        },
      };
    };

    const { path, body } = this.getBasicTracingData(executionContext);
    const tracing = createJaegerInstance();
    tracing.setTag('app', this.app);
    tracing.setTag('path', path);
    tracing.setTag('body', body);
    tracing.setTag('component', context);
    if (traceId) {
      tracing.setTag('traceId', traceId);
    }
    this.attachTracing(executionContext, tracing);

    return next.handle().pipe(
      tap(() => {
        this.interceptBeforeFinish(executionContext, tracing);
        tracing.finish();
      }),
    );
  }

  abstract buildSpan(executionContext: ExecutionContext): Span;
  abstract getTraceId(executionContext: ExecutionContext): string;
  abstract getBasicTracingData(executionContext: ExecutionContext): BasicTracingData;
  abstract attachTracing(executionContext: ExecutionContext, tracing: TracingType): void;
  abstract interceptBeforeFinish(executionContext: ExecutionContext, tracing: TracingType): void;

  protected getTracingLogger(logger: ILoggerService): TracingOptions {
    return {
      logger: {
        info: (message: string) => {
          logger.log(message);
        },
        error: (message: string) => {
          logger.error(message as unknown as InternalServerErrorException);
        },
      },
    };
  }
}
