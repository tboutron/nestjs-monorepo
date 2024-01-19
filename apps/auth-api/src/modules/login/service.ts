import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginPayload } from 'apps/auth-api/src/modules/login/payload/login.payload';
import { RegisterPayload } from 'apps/auth-api/src/modules/login/payload/register.payload';
import { UserTokenEntity } from 'apps/auth-api/src/modules/userTokens/entity';
import { TokenTypeEnum } from 'apps/auth-api/src/modules/userTokens/schema';
import { compare, hash } from 'bcrypt';
import { ApiException } from 'libs/utils';

import { IUserRepository } from '../user/adapter';
import { UserEntity } from '../user/entity';
import { IUserTokensRepository } from '../userTokens/adapter';
import { ILoginService } from './adapter';

@Injectable()
export class LoginService implements ILoginService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userTokenRepository: IUserTokensRepository,
  ) {}

  async register(payload: RegisterPayload): Promise<UserEntity> {
    const { created: haveCreatedUser, doc: createdUser } = await this.userRepository.create(payload);
    if (!haveCreatedUser) throw new ApiException(`username or password is invalid.`, HttpStatus.BAD_REQUEST);

    const { created } = await this.userTokenRepository.create({
      user: createdUser.id,
      type: TokenTypeEnum.PASSWORD,
      key: payload.email,
      value: await hash(payload.password, 10),
    });
    if (!created) throw new ApiException(`username or password is invalid.`, HttpStatus.BAD_REQUEST);
    return createdUser;
  }

  async login(payload: LoginPayload): Promise<UserTokenEntity> {
    const userToken: UserTokenEntity = await this.userTokenRepository.findOne({
      $or: [{ expireAt: undefined }, { expireAt: { $gt: new Date() } }],
      type: TokenTypeEnum.PASSWORD,
      key: payload.email,
    });
    if (!userToken) throw new ApiException(`username or password is invalid.`, HttpStatus.PRECONDITION_FAILED);

    const passwordMatch = await compare(payload.password, userToken.value).then(
      (x) => x,
      () => false,
    );
    if (!passwordMatch) throw new ApiException(`username or password is invalid.`, HttpStatus.PRECONDITION_FAILED);

    return userToken;
  }
}
