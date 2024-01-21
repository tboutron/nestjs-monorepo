import { ApiProperty } from '@nestjs/swagger';
import { Equals, IsEmail, IsIn, IsNotEmpty } from 'class-validator';
import { IsPasswordValid } from 'libs/modules/auth/password/validator';

export class LoginPasswordPayload {
  @ApiProperty({
    required: true,
    example: 'password',
  })
  @Equals('password')
  grant_type: 'password';

  @ApiProperty({
    required: true,
    example: 'user@mail.net',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    example: 'WKfJpmIMGRJ2FfVwT5g8^bMC*n1J&7gt',
  })
  @IsNotEmpty()
  @IsPasswordValid()
  password: string;
}

export class LoginRefreshTokenPayload {
  @ApiProperty({
    required: true,
    example: 'refresh_token',
  })
  @Equals('refresh_token')
  grant_type: 'refresh_token';

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  refresh_token: string;
}

export class LoginPayload {
  @ApiProperty({
    required: true,
    examples: ['password', 'refresh_token'],
  })
  @IsIn(['password', 'refresh_token'])
  grant_type: 'password' | 'refresh_token';

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  refresh_token: string;

  @ApiProperty({
    required: true,
    example: 'user@mail.net',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    example: 'WKfJpmIMGRJ2FfVwT5g8^bMC*n1J&7gt',
  })
  @IsNotEmpty()
  @IsPasswordValid()
  password: string;
}
