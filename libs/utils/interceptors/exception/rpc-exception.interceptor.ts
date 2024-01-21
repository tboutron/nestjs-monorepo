import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RpcExceptionInterceptor implements NestInterceptor {
  intercept(executionContext: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        const rpcContext = executionContext.switchToRpc().getContext();

        // this.sanitizeExternalError(error);

        if (typeof error === 'object' && !error.traceId) {
          error.traceId = rpcContext.traceId;
        }

        const context = `${executionContext.getClass().name}/${executionContext.getHandler().name}`;

        if (rpcContext?.tracing) {
          rpcContext.tracing.setTag(rpcContext.tracing.tags.ERROR, true);
          rpcContext.tracing.setTag('message', error.message);
          rpcContext.tracing.setTag('statusCode', error.status);
          rpcContext.tracing.addTags({ traceId: error.traceId });
          rpcContext.tracing.finish();
        }

        error.context = error.context = context;
        throw error;
      }),
    );
  }
}
