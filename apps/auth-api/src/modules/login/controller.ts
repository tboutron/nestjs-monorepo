import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserTokenEntity } from 'apps/auth-api/src/modules/userTokens/entity';
import { ITokenService } from 'libs/modules/auth/token/adapter';
import { Token } from 'libs/modules/auth/token/types';

import { ILoginService } from './adapter';
import { LoginPayload } from './payload/login.payload';
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

  @Post('login')
  @HttpCode(200)
  @ApiResponse(SwagggerResponse.login[200])
  @ApiResponse(SwagggerResponse.login[412])
  async login(@Body() payload: LoginPayload): Promise<Token> {
    const userToken: UserTokenEntity = await this.loginService.login(payload);
    return this.tokenService.sign({ userId: userToken.user.id });
  }
}
