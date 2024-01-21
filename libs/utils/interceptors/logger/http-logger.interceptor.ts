import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ILoggerService } from 'libs/modules/global/logger/adapter';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: ILoggerService) {}
  intercept(executionContext: ExecutionContext, next: CallHandler): Observable<unknown> {
    const context = `${executionContext.getClass().name}/${executionContext.getHandler().name}`;

    const request = executionContext.switchToHttp().getRequest();
    const response = executionContext.switchToHttp().getResponse();

    request['context'] = context;

    if (!request.headers?.traceId) {
      request.headers.traceId = uuidv4();
      request.id = request.headers.traceId;
    }

    this.loggerService.pino(request, response);
    return next.handle();
  }
}
