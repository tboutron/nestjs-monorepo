import { INestApplication } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginPasswordPayload } from 'apps/auth-api/src/modules/login/payload/login.payload';
import { RegisterPayload } from 'apps/auth-api/src/modules/login/payload/register.payload';
import { IUserTokensRepository } from 'apps/auth-api/src/modules/userTokens/adapter';
import { UserTokenEntity } from 'apps/auth-api/src/modules/userTokens/entity';
import { UserTokensRepository } from 'apps/auth-api/src/modules/userTokens/repository';
import { TokenTypeEnum, UserToken } from 'apps/auth-api/src/modules/userTokens/schema';
import { User } from 'libs/core/entities';
import { UsersServiceMessages } from 'libs/core/services-messages';
import { TokenModule } from 'libs/modules/auth/token/module';
import { SecretsModule } from 'libs/modules/global/secrets/module';
import { Model } from 'mongoose';
import { of } from 'rxjs';
import * as request from 'supertest';

import { ILoginService } from '../adapter';
import { LoginController } from '../controller';
import { LoginService } from '../service';

const mockedEmail = 'mock@email.fake';
const mockedPassword = 'mockPass42Secure';
const mockedPasswordHash = '$2b$10$f//0JBdTvqtSB2mXY6fqXO4FQWbmwhIxGDpLxAqQ6Fj4n/jGOIbj2';

jest.mock('crypto-random-string', () => ({
  async: jest.fn().mockImplementation(() => Promise.resolve('mocked_random_string')),
}));

const getMockUser = (): User => ({
  id: 'mockUserId',
  createdAt: new Date(),
  name: 'mockName',
  email: mockedEmail,
  username: 'mockUsername',
});

const getMockUserPasswordToken = (): UserTokenEntity => ({
  id: 'mockTokenId',
  createdAt: new Date(),
  type: TokenTypeEnum.PASSWORD,
  key: mockedEmail,
  value: mockedPasswordHash,
  user: getMockUser(),
});

const getMockUserRefreshToken = (): UserTokenEntity => ({
  id: 'mockTokenId',
  createdAt: new Date(),
  type: TokenTypeEnum.REFRESH,
  key: mockedEmail,
  value: 'mocked_refresh_token',
  user: getMockUser(),
});

describe('LoginController (e2e)', () => {
  let app: INestApplication;

  // if you want to mock model functions
  let userService: ClientProxy;
  let userTokenModel: Model<UserToken>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TokenModule, SecretsModule],
      controllers: [LoginController],
      providers: [
        {
          provide: ILoginService,
          useClass: LoginService,
        },
        {
          provide: IUserTokensRepository,
          useClass: UserTokensRepository,
        },
        {
          provide: 'USER_SERVICE',
          useValue: {
            send: jest.fn().mockImplementation((pattern) => {
              if (pattern === UsersServiceMessages.CREATE) {
                return of(getMockUser());
              }
            }),
          },
        },
        {
          provide: getModelToken(UserToken.name),
          useValue: {
            new: jest.fn(getMockUserPasswordToken),
            constructor: jest.fn(getMockUserPasswordToken),
            find: jest.fn(),
            findOne: jest.fn().mockReturnValue({
              populate: () => ({
                exec: jest.fn(getMockUserPasswordToken),
              }),
            }),
            // findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(getMockUserRefreshToken),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get('USER_SERVICE');
    userTokenModel = module.get(getModelToken(UserToken.name));
    app = module.createNestApplication();
    await app.init();
  });

  describe('/register (POST)', () => {
    it(`should register successfully`, async () => {
      const testUser = getMockUser();
      const registerPayload: RegisterPayload = {
        email: testUser.email,
        password: mockedPassword,
        username: testUser.username,
        name: testUser.name,
      };
      const spyCreateUser = jest.spyOn(userService, 'send');
      const spyCreateToken = jest.spyOn(userTokenModel, 'create');
      const response = await request(app.getHttpServer()).post('/auth/register').send(registerPayload);

      expect(spyCreateUser).toHaveBeenCalledTimes(1);
      expect(spyCreateToken).toHaveBeenCalledTimes(1);
      expect(response.body).toHaveProperty('token');

      return response;
    });
  });

  describe('/token (POST)', () => {
    it(`should login successfully`, async () => {
      const testUser = getMockUser();
      const loginPayload: LoginPasswordPayload = {
        grant_type: 'password',
        email: testUser.email,
        password: mockedPassword,
      };
      const spyFindToken = jest.spyOn(userTokenModel, 'findOne');
      const spyCreateToken = jest.spyOn(userTokenModel, 'create');
      const response = await request(app.getHttpServer()).post('/auth/token').send(loginPayload);

      expect(spyFindToken).toHaveBeenCalledTimes(1);
      expect(spyCreateToken).toHaveBeenCalledTimes(1);
      expect(response.body).toHaveProperty('token');

      return response;
    });

    it(`should throw "username or password is invalid" error`, async () => {
      return request(app.getHttpServer())
        .post('/auth/token')
        .send({ login: 'mockLogin', pass: 'passMock' })
        .expect(412);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
