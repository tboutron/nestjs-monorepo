import { ExecutionContext, Injectable } from '@nestjs/common';
import { TracingType } from 'libs/utils';
import { BasicTracingData, TracingInterceptor } from 'libs/utils/interceptors/logger/tracing.interceptor';
import { FORMAT_HTTP_HEADERS, Span, Tags } from 'opentracing';

@Injectable()
export class HttpTracingInterceptor extends TracingInterceptor {
  buildSpan(executionContext: ExecutionContext): Span {
    const request = executionContext.switchToHttp().getRequest();
    const parent = this.tracer.extract(FORMAT_HTTP_HEADERS, request.headers);
    const parentObject = parent ? { childOf: parent } : {};
    return this.tracer.startSpan(request.headers.host + request.path, parentObject);
  }

  getTraceId(executionContext: ExecutionContext): string {
    const request = executionContext.switchToHttp().getRequest();
    return request.id;
  }

  getBasicTracingData(executionContext: ExecutionContext): BasicTracingData {
    const request = executionContext.switchToHttp().getRequest();
    return {
      path: request.path,
      body: request.body,
    };
  }

  attachTracing(executionContext: ExecutionContext, tracing: TracingType) {
    const request = executionContext.switchToHttp().getRequest();
    request.tracing = tracing;
    tracing.setTag('ip', request.ip);
    tracing.setTag(Tags.HTTP_METHOD, request.method);
    tracing.setTag('headers', request.headers);
    tracing.setTag('query', request.query);
  }

  interceptBeforeFinish(executionContext: ExecutionContext, tracing: TracingType) {
    const res = executionContext.switchToHttp().getResponse();

    tracing.setTag(Tags.HTTP_STATUS_CODE, res.statusCode);
  }
}
