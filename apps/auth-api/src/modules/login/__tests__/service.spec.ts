import { Test } from '@nestjs/testing';
import { LoginPayload } from 'apps/auth-api/src/modules/login/payload/login.payload';
import { IUserTokensRepository } from 'apps/auth-api/src/modules/userTokens/adapter';
import { TokenTypeEnum } from 'apps/auth-api/src/modules/userTokens/schema';

import { IUserRepository } from '../../user/adapter';
import { ILoginService } from '../adapter';
import { LoginService } from '../service';
import { UserTokenEntity } from 'apps/auth-api/src/modules/userTokens/entity';

describe('LoginService', () => {
  let loginService: ILoginService;
  let userTokenRepository: IUserTokensRepository;

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
          provide: IUserRepository,
          useValue: {
            logged: jest.fn(),
          },
        },
        {
          provide: IUserTokensRepository,
          useValue: {
            logged: jest.fn(),
          },
        },
      ],
    }).compile();

    loginService = app.get(ILoginService);
    userTokenRepository = app.get(IUserTokensRepository);
  });

  describe('login', () => {
    const loginPayload: LoginPayload = { email: 'mock@mail.net', password: 'mockPass42Secure' };
    const userToken: UserTokenEntity = {
      user: {
        email: 'mock@email.fake',
        username: 'mockUsername',
        name: 'mockName',
        id: 'mockUserId',
        createdAt: new Date(),
      },
      createdAt: new Date(),
      type: TokenTypeEnum.PASSWORD,
      key: 'mock@mail.net',
      value: '$2b$10$f//0JBdTvqtSB2mXY6fqXO4FQWbmwhIxGDpLxAqQ6Fj4n/jGOIbj2',
    };

    test('should login successfully', async () => {
      userTokenRepository.findOne = jest.fn().mockResolvedValue(userToken);
      await expect(loginService.login(loginPayload)).resolves.toEqual(userToken);
    });

    test('should throw "not found login" error', async () => {
      userTokenRepository.findOne = jest.fn();
      await expect(loginService.login(loginPayload)).rejects.toThrow('username or password is invalid.');
    });
  });
});
