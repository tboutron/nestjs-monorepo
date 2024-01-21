import { Test } from '@nestjs/testing';
import { LoginPasswordPayload } from 'apps/auth-api/src/modules/login/payload/login.payload';
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
    value: '$2b$10$f//0JBdTvqtSB2mXY6fqXO4FQWbmwhIxGDpLxAqQ6Fj4n/jGOIbj2',
  };
  const userRefreshToken: UserTokenEntity = {
    user,
    createdAt: new Date(),
    type: TokenTypeEnum.REFRESH,
    key: user.email,
    value: '$2b$10$f//0JBdTvqtSB2mXY6fqXO4FQWbmwhIxGDpLxAqQ6Fj4n/jGOIbj2',
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
            findOne: jest.fn().mockResolvedValue(userPasswordToken),
            create: jest.fn().mockResolvedValue({ id: userRefreshToken.id, created: true, doc: userRefreshToken }),
          },
        },
        {
          provide: 'USER_SERVICE',
          useValue: {
            send: jest.fn().mockImplementation((pattern) => {
              if (pattern === UsersServiceMessages.CREATE) {
                return of({
                  email: 'mock@email.fake',
                  username: 'mockUsername',
                  name: 'mockName',
                  id: 'mockUserId',
                  createdAt: new Date(),
                });
              }
            }),
          },
        },
      ],
    }).compile();

    loginService = app.get(ILoginService);
    userTokenRepository = app.get(IUserTokensRepository);
  });

  describe('token', () => {
    test('should login successfully', async () => {
      const res = await loginService.login(loginPayload);
      expect(res).toEqual(userRefreshToken);
    });

    test('should throw "not found login" error', async () => {
      userTokenRepository.findOne = jest.fn();
      await expect(loginService.login(loginPayload)).rejects.toThrow('username or password is invalid.');
    });
  });
});
