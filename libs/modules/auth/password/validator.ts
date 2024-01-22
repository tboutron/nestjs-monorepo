import { registerDecorator, ValidationOptions } from 'class-validator';
import { ValidatorConstraintInterface } from 'class-validator/types/validation/ValidatorConstraintInterface';
import * as zxcvbn from 'zxcvbn';

export const passwordValidator: ValidatorConstraintInterface = {
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
};

export function IsPasswordValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: passwordValidator,
    });
  };
}
