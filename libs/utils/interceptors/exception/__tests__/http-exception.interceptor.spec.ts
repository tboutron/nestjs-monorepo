import { ExecutionContext } from '@nestjs/common';
import { CallHandler } from '@nestjs/common/interfaces';
import { Test } from '@nestjs/testing';
import { Observable, of } from 'rxjs';

import { HttpExceptionInterceptor } from '../http-exception.interceptor';

describe('ExceptionInterceptor', () => {
  const executionContextMock = jest.createMockFromModule<ExecutionContext>('@nestjs/common');
  const callHandlerMOck = jest.createMockFromModule<CallHandler>('@nestjs/common');
  let exceptionInterceptor: HttpExceptionInterceptor;

  beforeEach(async () => {
    jest.clearAllMocks();
    const app = await Test.createTestingModule({
      imports: [],
      providers: [HttpExceptionInterceptor],
    }).compile();

    exceptionInterceptor = app.get(HttpExceptionInterceptor);
  });

  test('should catch successfully', async () => {
    const mock = jest.createMockFromModule<Observable<unknown>>('rxjs');
    jest.spyOn(mock, 'pipe').mockReturnValue(of(true));
    callHandlerMOck.handle = () => mock;

    const result = exceptionInterceptor.intercept(executionContextMock, callHandlerMOck);

    expect(result).not.toBeUndefined();
  });
});
