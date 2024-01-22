import { ArgumentsHost, Catch, RpcExceptionFilter as BRpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ILoggerService } from 'libs/modules/global/logger/adapter';
import { AppRpcException } from 'libs/utils/exception';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class RpcExceptionFilter implements BRpcExceptionFilter<RpcException> {
  constructor(private readonly loggerService: ILoggerService) {}

  catch(exception: RpcException, host: ArgumentsHost): Observable<never> {
    const rpcHost = host.switchToRpc();
    const rpcContext = rpcHost.getContext();

    (exception as AppRpcException).traceId = rpcContext.traceId;

    const context = 'context' in exception ? exception.context : rpcContext.args[1];
    this.loggerService.error(exception, exception.message, context);

    return throwError(() => new AppRpcException(exception.getError(), context));
  }
}
