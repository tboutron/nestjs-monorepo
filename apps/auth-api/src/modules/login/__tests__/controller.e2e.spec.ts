import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginPayload } from 'apps/auth-api/src/modules/login/payload/login.payload';
import { RegisterPayload } from 'apps/auth-api/src/modules/login/payload/register.payload';
import { IUserTokensRepository } from 'apps/auth-api/src/modules/userTokens/adapter';
import { UserTokenEntity } from 'apps/auth-api/src/modules/userTokens/entity';
import { UserTokensRepository } from 'apps/auth-api/src/modules/userTokens/repository';
import { TokenTypeEnum, UserToken } from 'apps/auth-api/src/modules/userTokens/schema';
import { TokenModule } from 'libs/modules/auth/token/module';
import { SecretsModule } from 'libs/modules/global/secrets/module';
import { Model } from 'mongoose';
import * as request from 'supertest';

import { IUserRepository } from '../../user/adapter';
import { UserEntity } from '../../user/entity';
import { UserRepository } from '../../user/repository';
import { User, UserDocument } from '../../user/schema';
import { ILoginService } from '../adapter';
import { LoginController } from '../controller';
import { LoginService } from '../service';

const mockedEmail = 'mock@email.fake';
const mockedPassword = 'mockPass42Secure';
const mockedPasswordHash = '$2b$10$f//0JBdTvqtSB2mXY6fqXO4FQWbmwhIxGDpLxAqQ6Fj4n/jGOIbj2';
const getMockUser = (): UserEntity => ({
  id: 'mockUserId',
  createdAt: new Date(),
  name: 'mockName',
  email: mockedEmail,
  username: 'mockUsername',
});

const getMockUserToken = (): UserTokenEntity => ({
  id: 'mockTokenId',
  createdAt: new Date(),
  type: TokenTypeEnum.PASSWORD,
  key: 'mock@email.fake',
  value: mockedPasswordHash,
  user: getMockUser(),
});

describe('LoginController (e2e)', () => {
  let app: INestApplication;

  // if you want to mock model functions
  let userModel: Model<UserDocument>;
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
          provide: IUserRepository,
          useClass: UserRepository,
        },
        {
          provide: IUserTokensRepository,
          useClass: UserTokensRepository,
        },
        {
          provide: getModelToken(User.name),
          useValue: {
            new: jest.fn(getMockUser),
            constructor: jest.fn(getMockUser),
            find: jest.fn(),
            findOne: jest.fn(getMockUser),
            // findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(getMockUser),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken(UserToken.name),
          useValue: {
            new: jest.fn(getMockUserToken),
            constructor: jest.fn(getMockUserToken),
            find: jest.fn(),
            findOne: jest.fn(getMockUserToken),
            // findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(getMockUserToken),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    userModel = module.get(getModelToken(User.name));
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
      const spyCreateUser = jest.spyOn(userModel, 'create');
      const spyCreateToken = jest.spyOn(userTokenModel, 'create');
      const response = await request(app.getHttpServer()).post('/auth/register').send(registerPayload);

      expect(spyCreateUser).toHaveBeenCalledTimes(1);
      expect(spyCreateToken).toHaveBeenCalledTimes(1);
      expect(response.body).toHaveProperty('token');

      return response;
    });
  });

  describe('/login (POST)', () => {
    it(`should login successfully`, async () => {
      const testUser = getMockUser();
      const loginPayload: LoginPayload = {
        email: testUser.email,
        password: mockedPassword,
      };
      const spyFindToken = jest.spyOn(userTokenModel, 'findOne');
      const response = await request(app.getHttpServer()).post('/auth/login').send(loginPayload);

      expect(spyFindToken).toHaveBeenCalledTimes(1);
      expect(response.body).toHaveProperty('token');

      return response;
    });

    it(`should throw "username or password is invalid" error`, async () => {
      userModel.findOne = jest.fn();
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ login: 'mockLogin', pass: 'passMock' })
        .expect(412);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
