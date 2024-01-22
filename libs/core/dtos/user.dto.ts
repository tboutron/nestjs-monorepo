import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  name: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
