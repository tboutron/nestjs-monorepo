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

@Injectable()
export class RpcTracingInterceptor implements NestInterceptor {
  private tracer: JaegerTracer;
  private app: string;

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
    const data = executionContext.switchToRpc().getData();
    const rpcContext = executionContext.switchToRpc().getContext();
    const requestMessage = rpcContext.args[1];

    const span = this.tracer.startSpan(requestMessage);

    const createJaegerInstance = (): TracingType => {
      return {
        span: span,
        tracer: this.tracer,
        tags: Tags,
        axios: (options: AxiosRequestConfig = {}) => {
          const headers = {};
          this.tracer.inject(span, FORMAT_HTTP_HEADERS, headers);
          options.headers = { ...options.headers, ...headers /* traceId: rpcContext.id*/ };

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

    rpcContext.tracing = createJaegerInstance();

    rpcContext.tracing.setTag('app', this.app);
    rpcContext.tracing.setTag('path', requestMessage);
    rpcContext.tracing.setTag('body', data);
    rpcContext.tracing.setTag('component', context);

    if (rpcContext.id) {
      rpcContext.tracing.setTag('traceId', rpcContext.id);
    }

    return next.handle().pipe(
      tap(() => {
        rpcContext.tracing.finish();
      }),
    );
  }

  private getTracingLogger(logger: ILoggerService): TracingOptions {
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
