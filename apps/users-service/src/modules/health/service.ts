import { Injectable } from '@nestjs/common';
import { ILoggerService } from 'libs/modules/global/logger/adapter';

import { name, version } from '../../../package.json';
import { IUsersRepository } from '../user/adapter';
import { IHealthService } from './adapter';

@Injectable()
export class HealthService implements IHealthService {
  constructor(
    private readonly userRepository: IUsersRepository,
    private readonly loggerService: ILoggerService,
  ) {}

  async getText(): Promise<string> {
    const appName = `${name}-${version} UP!!`;
    this.loggerService.info({ message: appName, context: `HealthService/getText` });
    await this.userRepository.isConnected();
    return appName;
  }
}
