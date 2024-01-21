import { HttpStatus } from '@nestjs/common';

import { AppApiException } from '../exception';

describe('ApiException', () => {
  test('should ApiException successfully', () => {
    expect(() => {
      throw new AppApiException('BAD_GATEWAY', HttpStatus.BAD_GATEWAY);
    }).toThrow('BAD_GATEWAY');
  });

  test('should ApiException successfully without status', () => {
    expect(() => {
      throw new AppApiException('BAD_REQUEST');
    }).toThrow('BAD_REQUEST');
  });

  test('should ApiException successfully with context', () => {
    const error = new AppApiException('BAD_REQUEST', HttpStatus.BAD_GATEWAY, 'Error');
    expect(error).toBeInstanceOf(AppApiException);
  });
});
