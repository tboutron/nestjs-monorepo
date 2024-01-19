import { UserEntity } from '../user/entity';
import { LoginPayload } from './payload/login.payload';
import { RegisterPayload } from './payload/register.payload';

export abstract class ILoginService {
  abstract register(payload: RegisterPayload): Promise<UserEntity>;
  abstract login(payload: LoginPayload): Promise<UserEntity>;
}
