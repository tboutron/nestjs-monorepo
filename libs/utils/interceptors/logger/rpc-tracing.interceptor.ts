import { ExecutionContext, Injectable } from '@nestjs/common';
import { TracingType } from 'libs/utils';
import { BasicTracingData, TracingInterceptor } from 'libs/utils/interceptors/logger/tracing.interceptor';
import { Span } from 'opentracing';

@Injectable()
export class RpcTracingInterceptor extends TracingInterceptor {
  buildSpan(executionContext: ExecutionContext): Span {
    const rpcContext = executionContext.switchToRpc().getContext();
    const requestMessage = rpcContext.args[1];
    return this.tracer.startSpan(requestMessage);
  }

  getTraceId(executionContext: ExecutionContext): string {
    const rpcContext = executionContext.switchToRpc().getContext();
    return rpcContext.id;
  }

  getBasicTracingData(executionContext: ExecutionContext): BasicTracingData {
    const rpcHost = executionContext.switchToRpc();
    return {
      path: rpcHost.getContext().args[1],
      body: rpcHost.getData(),
    };
  }

  attachTracing(executionContext: ExecutionContext, tracing: TracingType) {
    const rpcContext = executionContext.switchToRpc().getContext();
    rpcContext.tracing = tracing;
  }

  interceptBeforeFinish() {
    // Nothing needed for now
  }
}
