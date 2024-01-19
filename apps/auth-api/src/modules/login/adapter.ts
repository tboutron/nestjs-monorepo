import { UserEntity } from '../user/entity';
import { LoginPayload } from './payload/login.payload';
import { RegisterPayload } from './payload/register.payload';
import { UserTokenEntity } from 'apps/auth-api/src/modules/userTokens/entity';

export abstract class ILoginService {
  abstract register(payload: RegisterPayload): Promise<UserEntity>;
  abstract login(payload: LoginPayload): Promise<UserTokenEntity>;
}
