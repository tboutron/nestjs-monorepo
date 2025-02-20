import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ILoggerService } from 'libs/modules/global/logger/adapter';

import { AppApiException } from '../../exception';
import { HttpExceptionFilter } from '../http-exception.filter';

const mock = jest.createMockFromModule<ArgumentsHost>('@nestjs/common');

describe('AppExceptionFilter', () => {
  let appExceptionFilter: HttpExceptionFilter;

  beforeEach(async () => {
    jest.clearAllMocks();
    const app = await Test.createTestingModule({
      providers: [
        HttpExceptionFilter,
        {
          provide: ILoggerService,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    mock.switchToHttp = () => ({
      getNext: jest.fn(),
      getResponse: jest.fn().mockReturnValue({
        status: () => ({ json: jest.fn() }),
      }),
      getRequest: jest.fn().mockReturnValue({
        url: 'url',
      }),
    });

    appExceptionFilter = app.get(HttpExceptionFilter);
  });

  test('should catch successfully', () => {
    const error = new AppApiException('Error', HttpStatus.INTERNAL_SERVER_ERROR);

    appExceptionFilter.catch(error, mock);
  });

  test('should catch successfully without code and context', () => {
    const error = new AppApiException('Error');

    error.statusCode = undefined;
    error.context = undefined;

    appExceptionFilter.catch(error, mock);
  });

  test('should catch successfully with unknown status', () => {
    const error = new AppApiException('Error', 100);

    error.statusCode = undefined;
    error.context = undefined;

    appExceptionFilter.catch(error, mock);
  });

  test('should catch successfully without error message', () => {
    const error = jest.createMockFromModule<AppApiException>('@nestjs/common');

    appExceptionFilter.catch(error, mock);
  });
});
