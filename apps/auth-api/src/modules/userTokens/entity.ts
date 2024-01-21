import { ApiProperty } from '@nestjs/swagger';
import { User } from 'libs/core/entities';

import { TokenTypeEnum, UserToken } from './schema';

export class UserTokenEntity implements UserToken {
  id?: string;

  @ApiProperty()
  user: User;

  createdAt: Date;
  expireAt?: Date;

  type: TokenTypeEnum;

  key: string;
  value?: string;
  origin?: UserToken;
}
