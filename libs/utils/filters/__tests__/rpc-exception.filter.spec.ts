import { ArgumentsHost } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { RpcException } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { ILoggerService } from 'libs/modules/global/logger/adapter';
import { AppRpcException } from 'libs/utils/exception';

import { RpcExceptionFilter } from '../rpc-exception.filter';

const genericErrorName = 'Test exception';

describe('RpcExceptionFilter', () => {
  let filter: RpcExceptionFilter;
  let loggerService: ILoggerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RpcExceptionFilter,
        {
          provide: ILoggerService,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    filter = moduleRef.get<RpcExceptionFilter>(RpcExceptionFilter);
    loggerService = moduleRef.get<ILoggerService>(ILoggerService);
  });

  it('should log exception information', () => {
    const exception = new AppRpcException(genericErrorName);
    const host = new ExecutionContextHost([]);

    jest.spyOn(host, 'switchToRpc').mockReturnValue({
      getContext: () => ({ traceId: '123', args: [1, 'context'] }),
    } as never);

    filter.catch(exception, host as ArgumentsHost);

    expect(loggerService.error).toHaveBeenCalledWith(exception, exception.message, undefined);
  });

  it('should add traceId to exception', () => {
    const exception = new AppRpcException(genericErrorName);
    const host = new ExecutionContextHost([]);

    jest.spyOn(host, 'switchToRpc').mockReturnValue({
      getContext: () => ({ traceId: '123', args: [1, 'context'] }),
    } as never);

    filter.catch(exception, host as ArgumentsHost);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((exception as any).traceId).toBe('123');
  });

  it('should throw the original error', () => {
    return new Promise<void>((done) => {
      const exception = new RpcException(genericErrorName);
      const host = new ExecutionContextHost([]);

      jest.spyOn(host, 'switchToRpc').mockReturnValue({
        getContext: () => ({ traceId: '123', args: [1, 'context'] }),
      } as never);

      filter.catch(exception, host as ArgumentsHost).subscribe({
        error(err) {
          expect(err).toStrictEqual(new AppRpcException(exception));
          done();
        },
      });
    });
  });
});
