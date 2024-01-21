import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TokenModule } from 'libs/modules/auth/token/module';
import { ISecretsService } from 'libs/modules/global/secrets/adapter';

import { UserTokensModule } from '../userTokens/module';
import { ILoginService } from './adapter';
import { LoginController } from './controller';
import { LoginService } from './service';

@Module({
  imports: [TokenModule, UserTokensModule],
  controllers: [LoginController],
  providers: [
    {
      provide: ILoginService,
      useClass: LoginService,
    },
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
  exports: [ILoginService],
})
export class LoginModule {}
