import { HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export type ErrorModel = {
  error: {
    code: string | number;
    traceId: string;
    message: string;
    timestamp: string;
    path: string;
  };
};

export class AppApiException extends HttpException {
  context: string;
  traceId: string;
  statusCode: number;
  code?: string;
  config?: unknown;
  user?: string;

  constructor(
    error: string | object,
    status?: HttpStatus,
    private readonly ctx?: string,
  ) {
    super(error, [status, 500].find(Boolean));
    this.statusCode = super.getStatus();

    if (ctx) {
      this.context = ctx;
    }
  }
}
export class AppRpcException extends RpcException {
  context: string;
  traceId: string;
  code?: string;
  config?: unknown;
  user?: string;

  constructor(
    error: string | object,
    private readonly ctx?: string,
  ) {
    super(error);

    if (ctx) {
      this.context = ctx;
    }
  }
}
