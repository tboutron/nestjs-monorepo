import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TokenModule } from 'libs/modules/auth/token/module';
import { IsLoggedMiddleware } from 'libs/utils/middleware/auth/is-logged.middleware';

import { ITeamsRepository } from './adapter';
import { TeamsController } from './controller';
import { TeamsRepositoryProvider } from './repository';
import { TeamsServiceProvider } from './service';

@Module({
  imports: [TokenModule],
  controllers: [TeamsController],
  providers: [TeamsRepositoryProvider, TeamsServiceProvider],
  exports: [ITeamsRepository],
})
export class TeamsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(IsLoggedMiddleware).forRoutes({ path: '/teams', method: RequestMethod.ALL });
  }
}
