import { validate } from 'class-validator';
import { IsPasswordValid, passwordValidator } from 'libs/modules/auth/password/validator';

const STRONG_PASSWORD = 'sZcrmD^*pIxivY0gDd2F9Z&uoSxuSl#@';
describe('IsPasswordValid', () => {
  describe('passwordValidator', () => {
    test('should valid correct password', async () => {
      expect(passwordValidator.validate('qf!DW8RnNxkUbEB#')).toBe(true);
      expect(passwordValidator.defaultMessage()).toBe('Something went wrong');
    });

    test('should not be null', async () => {
      expect(passwordValidator.validate('')).toBe(false);
      expect(passwordValidator.defaultMessage()).toBe('Empty password');
    });

    test('should be strong', async () => {
      expect(passwordValidator.validate('weak')).toBe(false);
      expect(passwordValidator.defaultMessage()).toBe('Password is too weak');
    });
  });

  describe('Decorator', () => {
    test('should valid correct password', async () => {
      const spy = jest.spyOn(passwordValidator, 'validate');

      class SomeInput {
        @IsPasswordValid()
        password: string;
      }
      const input = new SomeInput();
      input.password = STRONG_PASSWORD;
      return validate(input).then((errors) => {
        expect(errors.length).toBe(0);
        expect(spy).toHaveBeenCalledWith(STRONG_PASSWORD, {
          constraints: [],
          object: { password: STRONG_PASSWORD },
          property: 'password',
          targetName: 'SomeInput',
          value: STRONG_PASSWORD,
        });
      });
    });
  });
});
