import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ILoggerService } from 'libs/modules/global/logger/adapter';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RpcLoggerInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: ILoggerService) {}
  intercept(executionContext: ExecutionContext, next: CallHandler): Observable<unknown> {
    const context = `${executionContext.getClass().name}/${executionContext.getHandler().name}`;

    const rpcContext = executionContext.switchToRpc().getContext();

    rpcContext.context = context;

    if (!rpcContext.headers?.traceId) {
      rpcContext.traceId = uuidv4();
      rpcContext.id = rpcContext.traceId;
    }

    // eslint-disable-next-line unicorn/no-useless-undefined
    // this.loggerService.pino(rpcContext, undefined);
    this.loggerService.info({
      message: `request ${executionContext.switchToRpc().getContext().args[1]}`,
      context,
      obj: { data: executionContext.switchToRpc().getData() },
    });
    return next.handle();
  }
}
