import { Module } from '@nestjs/common';
import { LoggerModule } from 'libs/modules/global/logger/module';

import { UserTokensModule } from '../userTokens/module';
import { IHealthService } from './adapter';
import { HealthController } from './controller';
import { HealthService } from './service';

@Module({
  imports: [UserTokensModule, LoggerModule],
  controllers: [HealthController],
  providers: [
    {
      provide: IHealthService,
      useClass: HealthService,
    },
  ],
})
export class HealthModule {}
