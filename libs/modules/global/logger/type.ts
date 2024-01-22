import { HttpException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AppApiException } from 'libs/utils';

export type MessageType = {
  /**
   * message to be logged
   */
  message: string;
  /**
   * method or class that accour message
   */
  context?: string;
  /**
   * addtional object to log
   */
  obj?: object;
};

export type ErrorType = HttpException | RpcException | AppApiException;
