import { Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { UsersController } from 'apps/users-service/src/modules/user/controller';
import { UsersService } from 'apps/users-service/src/modules/user/service';
import { ConnectionName } from 'libs/modules/database/enum';
import { Connection, Model } from 'mongoose';

import { IUsersRepository, IUsersService } from './adapter';
import { UserRepository } from './repository';
import { User, UserDocument, UserSchema } from './schema';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: IUsersRepository,
      useFactory: (connection: Connection) =>
        new UserRepository(connection.model(User.name, UserSchema) as unknown as Model<UserDocument>),
      inject: [getConnectionToken(ConnectionName.USER)],
    },
    {
      provide: IUsersService,
      useClass: UsersService,
    },
  ],
  exports: [IUsersRepository],
})
export class UserModule {}
