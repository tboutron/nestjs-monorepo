import { ApiProperty } from '@nestjs/swagger';
import { IsPasswordValid } from 'apps/auth-api/src/modules/user/entity';
import { IsAlphanumeric, IsEmail, IsNotEmpty, Matches } from 'class-validator';

/**
 * Register Payload Class
 */
export class RegisterPayload {
  /**
   * Email field
   */
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Password field
   */
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsPasswordValid()
  password: string;

  /**
   * Username field
   */
  @ApiProperty({
    required: true,
  })
  @IsAlphanumeric()
  @IsNotEmpty()
  username: string;

  /**
   * Name field
   */
  @ApiProperty({
    required: true,
  })
  @Matches(/^[ A-Za-z]+$/)
  @IsNotEmpty()
  name: string;
}
