import { Test } from '@nestjs/testing';
import { LoginPasswordPayload } from 'apps/auth-api/src/modules/login/payload/login.payload';
import { RegisterPayload } from 'apps/auth-api/src/modules/login/payload/register.payload';
import { IUserTokensRepository } from 'apps/auth-api/src/modules/userTokens/adapter';
import { UserTokenEntity } from 'apps/auth-api/src/modules/userTokens/entity';
import { TokenTypeEnum } from 'apps/auth-api/src/modules/userTokens/schema';
import { UsersServiceMessages } from 'libs/core/services-messages';
import { of } from 'rxjs';

import { ILoginService } from '../adapter';
import { LoginService } from '../service';

jest.mock('crypto-random-string', () => ({
  async: jest.fn().mockImplementation(() => Promise.resolve('mocked_random_string')),
}));

describe('LoginService', () => {
  let loginService: ILoginService;
  let userTokenRepository: IUserTokensRepository;

  const registerPayload: RegisterPayload = {
    email: 'mock@mail.net',
    password: 'mockPass42Secure',
    name: 'mockName',
    username: 'mockUsername',
  };
  const loginPayload: LoginPasswordPayload = {
    grant_type: 'password',
    email: 'mock@mail.net',
    password: 'mockPass42Secure',
  };
  const user = {
    email: 'mock@email.fake',
    username: 'mockUsername',
    name: 'mockName',
    id: 'mockUserId',
    createdAt: new Date(),
  };
  const userPasswordToken: UserTokenEntity = {
    user,
    createdAt: new Date(),
    type: TokenTypeEnum.PASSWORD,
    key: user.email,
    value: '$2b$10$4K12GkZ.rmzl0MX0DuBhS.T41BtVHrhTJKX2Wg/20CMkFKfWo3kBO',
  };
  const userRefreshToken: UserTokenEntity = {
    user,
    createdAt: new Date(),
    type: TokenTypeEnum.REFRESH,
    key: user.email,
    value: '$2b$10$4K12GkZ.rmzl0MX0DuBhS.T41BtVHrhTJKX2Wg/20CMkFKfWo3kBO',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const app = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: ILoginService,
          useClass: LoginService,
        },
        {
          provide: IUserTokensRepository,
          useValue: {
            findOne: jest.fn().mockReturnValue(userPasswordToken),
            create: jest.fn().mockResolvedValue({ id: userRefreshToken.id, created: true, doc: userRefreshToken }),
          },
        },
        {
          provide: 'USER_SERVICE',
          useValue: {
            send: jest.fn().mockImplementation((pattern) => {
              if (pattern === UsersServiceMessages.CREATE) {
                return of(user);
              }
            }),
          },
        },
      ],
    }).compile();

    loginService = app.get(ILoginService);
    userTokenRepository = app.get(IUserTokensRepository);
  });

  describe('register', () => {
    test('should register successfully', async () => {
      const res = await loginService.register(registerPayload);
      expect(res).toEqual(user);
    });
  });

  describe('token', () => {
    test('should login successfully', async () => {
      const res = await loginService.login(loginPayload);
      expect(res).toEqual(userRefreshToken);
    });

    test('should fail if user is invalid', async () => {
      userTokenRepository.findOne = jest.fn();
      await expect(loginService.login(loginPayload)).rejects.toThrow('username or password is invalid.');
    });

    test('should fail if wrong password', async () => {
      userTokenRepository.findOne = jest.fn().mockReturnValue({ ...userPasswordToken, value: 'wrongPassword' });
      await expect(loginService.login(loginPayload)).rejects.toThrow('username or password is invalid.');
    });
  });
});
