import { Injectable } from '@nestjs/common';
import { name, version } from 'apps/auth-api/package.json';
import { IUserTokensRepository } from 'apps/auth-api/src/modules/userTokens/adapter';
import { ILoggerService } from 'libs/modules/global/logger/adapter';

import { IUserRepository } from '../user/adapter';
import { IHealthService } from './adapter';

@Injectable()
export class HealthService implements IHealthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userTokenRepository: IUserTokensRepository,
    private readonly loggerService: ILoggerService,
  ) {}

  async getText(): Promise<string> {
    const appName = `${name}-${version} UP!!`;
    this.loggerService.info({ message: appName, context: `HealthService/getText` });
    await this.userRepository.isConnected();
    await this.userTokenRepository.isConnected();
    return appName;
  }
}
