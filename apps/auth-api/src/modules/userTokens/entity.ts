import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'apps/auth-api/src/modules/user/entity';

import { TokenTypeEnum, UserToken } from './schema';

export class UserTokenEntity implements UserToken {
  id?: string;

  @ApiProperty()
  user: UserEntity;

  createdAt: Date;
  expireAt?: Date;

  type: TokenTypeEnum;

  key: string;
  value?: string;
  origin?: UserToken;
}
