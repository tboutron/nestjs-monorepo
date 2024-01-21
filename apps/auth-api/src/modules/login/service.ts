import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginPasswordPayload } from 'apps/auth-api/src/modules/login/payload/login.payload';
import { RegisterPayload } from 'apps/auth-api/src/modules/login/payload/register.payload';
import { UserTokenEntity } from 'apps/auth-api/src/modules/userTokens/entity';
import { TokenTypeEnum } from 'apps/auth-api/src/modules/userTokens/schema';
import { compare, hash } from 'bcrypt';
import { async as cryptoRandomStringAsync } from 'crypto-random-string';
import { User } from 'libs/core/entities';
import { UsersServiceMessages } from 'libs/core/services-messages';
import { AppApiException } from 'libs/utils';
import { firstValueFrom } from 'rxjs';

import { IUserTokensRepository } from '../userTokens/adapter';
import { ILoginService } from './adapter';

@Injectable()
export class LoginService implements ILoginService {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    private readonly userTokenRepository: IUserTokensRepository,
  ) {}

  async register(payload: RegisterPayload): Promise<User> {
    try {
      const createdUser = await firstValueFrom<User>(this.userServiceClient.send(UsersServiceMessages.CREATE, payload));
      await this.userTokenRepository.create({
        user: createdUser,
        type: TokenTypeEnum.PASSWORD,
        key: payload.email,
        value: await hash(payload.password, 10),
      });

      return createdUser;
    } catch (error) {
      if (error.message === 'Duplicate key error') {
        throw new AppApiException(`username or email already exists.`, HttpStatus.CONFLICT);
      }
      throw error;
    }
  }

  async login(payload: LoginPasswordPayload): Promise<UserTokenEntity> {
    const userToken: UserTokenEntity = await this.userTokenRepository.findOne({
      $or: [{ expireAt: undefined }, { expireAt: { $gt: new Date() } }],
      type: TokenTypeEnum.PASSWORD,
      key: payload.email,
    });
    if (!userToken) throw new AppApiException(`username or password is invalid.`, HttpStatus.PRECONDITION_FAILED);

    const passwordMatch = await compare(payload.password, userToken.value).then(
      (x) => x,
      () => false,
    );
    if (!passwordMatch) throw new AppApiException(`username or password is invalid.`, HttpStatus.PRECONDITION_FAILED);

    return this.createRefreshToken(userToken.user, new Date(), userToken);
  }

  async createRefreshToken(user: User, now: Date, origin?: UserTokenEntity): Promise<UserTokenEntity> {
    const refreshToken = new UserTokenEntity();
    refreshToken.user = user;
    refreshToken.createdAt = now;
    refreshToken.expireAt = new Date(now.getTime() + 1000 * 3600 * 24 * 30); // 1 month
    refreshToken.type = TokenTypeEnum.REFRESH;
    refreshToken.key = await cryptoRandomStringAsync({ length: 20 });
    refreshToken.origin = origin;
    const { doc } = await this.userTokenRepository.create(refreshToken);
    return doc;
  }
}
