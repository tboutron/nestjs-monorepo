import { Test } from '@nestjs/testing';

import { ISecretsService } from '../adapter';
import { SecretsModule } from '../module';

describe('SecretsService', () => {
  let commonSecrets: ISecretsService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [SecretsModule],
    }).compile();

    commonSecrets = app.get(ISecretsService);
  });

  describe('common', () => {
    test('should get common secrets successfully', () => {
      expect(commonSecrets.ENV).toEqual('test');
    });
  });

  describe('usersService', () => {
    test('should get mainAPI secrets successfully', () => {
      expect(commonSecrets.usersService.port).toEqual('3000');
    });
  });

  describe('authAPI', () => {
    test('should get authAPI secrets successfully', () => {
      expect(commonSecrets.authAPI.port).toEqual('4000');
    });
  });

  describe('teamsAPI', () => {
    test('should get mainAPI secrets successfully', () => {
      expect(commonSecrets.teamsAPI.port).toEqual('5000');
    });
  });
});
