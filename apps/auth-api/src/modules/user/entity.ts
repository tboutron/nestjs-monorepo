import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, registerDecorator, ValidationOptions } from 'class-validator';
import * as zxcvbn from 'zxcvbn';

import { User } from './schema';

export function IsPasswordValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: never) {
          if (!value) {
            this.error = 'Empty password';
            return false;
          }
          const result = zxcvbn(value);
          if (result.score <= 2) {
            this.error = 'Password is too weak';
            return false;
          }
          return true;
        },
        defaultMessage(): string {
          return this.error || 'Something went wrong';
        },
      },
    });
  };
}

export class UserEntity implements User {
  id?: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  name: string;

  createdAt: Date;
}
