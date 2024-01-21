import { HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ISecretsService } from 'libs/modules/global/secrets/adapter';
import { AppApiException } from 'libs/utils';

import { ITokenService, JwtBody } from './adapter';
import { Token } from './types';

@Injectable()
export class TokenService implements ITokenService {
  constructor(private readonly secret: ISecretsService) {}

  sign(model: object, options?: jwt.SignOptions): Token {
    const token = jwt.sign(
      model,
      this.secret.authAPI.jwtToken,
      options || {
        expiresIn: 15 * 60, // 5 minutes
      },
    );

    return { token };
  }

  async verify(token: string): Promise<JwtBody> {
    return new Promise((res, rej) => {
      jwt.verify(token, this.secret.authAPI.jwtToken, (error, decoded) => {
        if (error)
          rej(new AppApiException(error.message, HttpStatus.UNAUTHORIZED, `${TokenService.name}/${this.verify.name}`));

        res(decoded as JwtBody);
      });
    });
  }

  decode(token: string): JwtBody {
    return jwt.decode(token) as JwtBody;
  }
}
