import { Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { ConnectionName } from 'libs/modules/database/enum';
import { Connection, Model } from 'mongoose';

import { IUserTokensRepository } from './adapter';
import { UserTokensRepository } from './repository';
import { UserToken, UserTokenDocument, UserTokenSchema } from './schema';

@Module({
  controllers: [],
  providers: [
    {
      provide: IUserTokensRepository,
      useFactory: (connection: Connection) =>
        new UserTokensRepository(
          connection.model(UserToken.name, UserTokenSchema) as unknown as Model<UserTokenDocument>,
        ),
      inject: [getConnectionToken(ConnectionName.AUTH)],
    },
  ],
  exports: [IUserTokensRepository],
})
export class UserTokensModule {}
