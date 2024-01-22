import { Body, Controller, HttpCode, HttpStatus, Post, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiExtraModels, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ITokenService } from 'libs/modules/auth/token/adapter';
import { Token } from 'libs/modules/auth/token/types';
import { AppApiException } from 'libs/utils';

import { UserTokenEntity } from '../userTokens/entity';
import { ILoginService } from './adapter';
import { LoginPasswordPayload, LoginRefreshTokenPayload } from './payload/login.payload';
import { RegisterPayload } from './payload/register.payload';
import { SwagggerResponse } from './swagger';

@Controller('auth')
@ApiTags('login')
export class LoginController {
  constructor(
    private readonly loginService: ILoginService,
    private readonly tokenService: ITokenService,
  ) {}

  @Post('register')
  @HttpCode(200)
  @ApiResponse(SwagggerResponse.register[201])
  @ApiResponse(SwagggerResponse.register[400])
  @ApiResponse(SwagggerResponse.register[401])
  async register(@Body() payload: RegisterPayload): Promise<Token> {
    const user = await this.loginService.register(payload);
    return this.tokenService.sign({ userId: user.id });
  }

  @Post('token')
  @HttpCode(200)
  @ApiResponse(SwagggerResponse.token[200])
  @ApiResponse(SwagggerResponse.token[412])
  @ApiExtraModels(LoginPasswordPayload, LoginRefreshTokenPayload)
  @ApiBody({
    schema: {
      oneOf: [{ $ref: getSchemaPath(LoginPasswordPayload) }, { $ref: getSchemaPath(LoginRefreshTokenPayload) }],
    },
  })
  async token(
    @Body({
      transform: async (value: LoginPasswordPayload | LoginRefreshTokenPayload) => {
        let transformed: LoginPasswordPayload | LoginRefreshTokenPayload;
        if (value.grant_type === 'password') {
          transformed = plainToInstance(LoginPasswordPayload, value);
        } else if (value.grant_type === 'refresh_token') {
          transformed = plainToInstance(LoginRefreshTokenPayload, value);
        } else {
          throw new AppApiException(`grant_type is invalid.`, HttpStatus.PRECONDITION_FAILED);
        }

        const validation = await validate(transformed);
        if (validation.length > 0) {
          const validationPipe = new ValidationPipe({ errorHttpStatusCode: HttpStatus.PRECONDITION_FAILED });
          const exceptionFactory = validationPipe.createExceptionFactory();
          throw exceptionFactory(validation);
        }

        return transformed;
      },
    })
    payload: LoginPasswordPayload | LoginRefreshTokenPayload,
  ): Promise<Token> {
    const userToken: UserTokenEntity = await this.loginService.login(payload);
    return this.tokenService.sign({ userId: userToken.user.id });
  }
}
