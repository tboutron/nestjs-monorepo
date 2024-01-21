import { User } from 'libs/core/entities';

import { UserTokenEntity } from '../userTokens/entity';
import { LoginPasswordPayload, LoginRefreshTokenPayload } from './payload/login.payload';
import { RegisterPayload } from './payload/register.payload';

export abstract class ILoginService {
  abstract register(payload: RegisterPayload): Promise<User>;
  abstract login(payload: LoginPasswordPayload | LoginRefreshTokenPayload): Promise<UserTokenEntity>;
}
