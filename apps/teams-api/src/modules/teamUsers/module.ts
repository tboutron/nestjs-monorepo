import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TeamsRepositoryProvider } from 'apps/teams-api/src/modules/teams/repository';
import { TeamsServiceProvider } from 'apps/teams-api/src/modules/teams/service';
import { TokenModule } from 'libs/modules/auth/token/module';
import { ISecretsService } from 'libs/modules/global/secrets/adapter';
import { HttpModule } from 'libs/modules/http/module';
import { IsLoggedMiddleware } from 'libs/utils/middleware/auth/is-logged.middleware';

import { TeamUsersController } from './controller';
import { TeamUsersRepositoryProvider } from './repository';
import { TeamUsersServiceProvider } from './service';

@Module({
  imports: [TokenModule, HttpModule],
  controllers: [TeamUsersController],
  providers: [
    TeamUsersRepositoryProvider,
    TeamUsersServiceProvider,
    TeamsRepositoryProvider,
    TeamsServiceProvider,
    {
      provide: 'USER_SERVICE',
      useFactory: (secretsService: ISecretsService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: { port: secretsService.usersService.port },
        });
      },
      inject: [ISecretsService],
    },
  ],
})
export class TeamUsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(IsLoggedMiddleware).forRoutes({ path: '/team-users', method: RequestMethod.ALL });
  }
}
