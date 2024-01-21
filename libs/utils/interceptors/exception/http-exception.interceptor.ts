import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { ApiRequest } from 'libs/utils/request';
import { MongoError } from 'mongodb';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatError = (error: any): { message: string; status: number } => {
  if (error instanceof MongoError) {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (error.code) {
      case 11_000: {
        return {
          message: 'Already exists',
          status: HttpStatus.CONFLICT,
        };
      }
      default: {
        return {
          message: 'Error',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        };
        break;
      }
    }
  }

  const isClassValidatorError = [
    error.status === HttpStatus.PRECONDITION_FAILED,
    Array.isArray(error?.response?.message),
  ].every(Boolean);
  if (isClassValidatorError) {
    const msg = error?.response?.message.join(', ');
    error.response.message = msg;
    return { message: msg, status: error.status };
  }

  return { message: error.message, status: error.status };
};

@Injectable()
export class HttpExceptionInterceptor implements NestInterceptor {
  intercept(executionContext: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        formatError(error);

        const request: ApiRequest = executionContext.switchToHttp().getRequest();

        const headers = executionContext.getArgs()[0]?.headers;

        error.user = headers.user;

        this.sanitizeExternalError(error);

        if (typeof error === 'object' && !error.traceId) {
          error.traceId = headers.traceId;
        }

        const context = `${executionContext.getClass().name}/${executionContext.getHandler().name}`;

        if (request?.tracing) {
          request.tracing.setTag(request.tracing.tags.ERROR, true);
          request.tracing.setTag('message', error.message);
          request.tracing.setTag('statusCode', error.status);
          request.tracing.addTags({ traceId: error.traceId });
          request.tracing.finish();
        }

        error.context = error.context = context;
        throw error;
      }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sanitizeExternalError(error: any) {
    if (typeof error?.response === 'object' && error?.isAxiosError) {
      error['getResponse'] = () => ({ ...error?.response?.data?.error });
      error['getStatus'] = () => [error?.response?.data?.error?.code, error?.status].find(Boolean);
      error.message = [error?.response?.data?.error?.message, error.message].find(Boolean);
      error.traceId = error?.response?.data?.error?.traceId;
    }
  }
}
