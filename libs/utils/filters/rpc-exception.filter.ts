import { ArgumentsHost, Catch, RpcExceptionFilter as BRpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ILoggerService } from 'libs/modules/global/logger/adapter';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class RpcExceptionFilter implements BRpcExceptionFilter<RpcException> {
  constructor(private readonly loggerService: ILoggerService) {}

  catch(exception: RpcException, host: ArgumentsHost): Observable<never> {
    const context = host.switchToRpc();
    const rpcContext = context.getContext();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (exception as any).traceId = rpcContext.traceId;

    // this.loggerService.error(exception, exception.message, rpcContext.args[1]);
    this.loggerService.info({ message: exception.message, context: rpcContext.args[1], obj: exception });

    return throwError(() => exception.getError());
  }
}
