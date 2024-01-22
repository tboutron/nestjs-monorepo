import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import { IUsersRepository } from '../adapter';
import { UserRepository } from '../repository';
import { User } from '../schema';

describe('UserRepository', () => {
  let userRepository: IUsersRepository;

  beforeEach(async () => {
    jest.clearAllMocks();
    const app = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: IUsersRepository,
          useClass: UserRepository,
        },
        {
          provide: getModelToken(User.name),
          useValue: {},
        },
      ],
    }).compile();

    userRepository = app.get(IUsersRepository);
  });
  test('should verify instance', async () => {
    expect(userRepository).toBeInstanceOf(UserRepository);
  });
});
