import * as jwt from 'jsonwebtoken';

import { Token } from './types';

export interface JwtBody {
  sub: string | undefined;
}

export abstract class ITokenService {
  abstract sign(model: object, options?: jwt.JwtPayload): Token;
  abstract verify(token: string): Promise<JwtBody>;
  abstract decode(token: string): JwtBody;
}
