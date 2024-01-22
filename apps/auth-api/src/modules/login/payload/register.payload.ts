import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { IsPasswordValid } from 'libs/modules/auth/password/validator';

/**
 * Register Payload Class
 */
export class RegisterPayload {
  /**
   * Email field
   */
  @ApiProperty({
    required: true,
    example: 'user@mail.net',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Password field
   */
  @ApiProperty({
    required: true,
    example: 'WKfJpmIMGRJ2FfVwT5g8^bMC*n1J&7gt',
  })
  @IsNotEmpty()
  @IsPasswordValid()
  password: string;

  /**
   * Username field
   */
  @ApiProperty({
    required: true,
    example: 'exampleUser123',
  })
  @IsAlphanumeric()
  @IsNotEmpty()
  username: string;

  /**
   * Name field
   */
  @ApiProperty({
    required: true,
    example: 'John Doe',
  })
  @Matches(/^[ A-Za-z]+$/)
  @IsNotEmpty()
  name: string;
}
