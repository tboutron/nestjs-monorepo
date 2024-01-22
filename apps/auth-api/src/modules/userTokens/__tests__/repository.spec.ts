import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import { IUserTokensRepository } from '../adapter';
import { UserTokensRepository } from '../repository';
import { UserToken } from '../schema';

describe('UserTokenRepository', () => {
  let userTokenRepository: IUserTokensRepository;

  beforeEach(async () => {
    jest.clearAllMocks();
    const app = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: IUserTokensRepository,
          useClass: UserTokensRepository,
        },
        {
          provide: getModelToken(UserToken.name),
          useValue: {},
        },
      ],
    }).compile();

    userTokenRepository = app.get(IUserTokensRepository);
  });
  test('should verify instance', async () => {
    expect(userTokenRepository).toBeInstanceOf(UserTokensRepository);
  });
});
