import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import { ITeamUsersRepository } from '../adapter';
import { TeamUsersRepository } from '../repository';
import { TeamUser } from '../schema';

describe('TeamUserRepository', () => {
  let teamUserRepository: ITeamUsersRepository;

  beforeEach(async () => {
    jest.clearAllMocks();
    const app = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: ITeamUsersRepository,
          useClass: TeamUsersRepository,
        },
        {
          provide: getModelToken(TeamUser.name),
          useValue: {},
        },
      ],
    }).compile();

    teamUserRepository = app.get(ITeamUsersRepository);
  });
  test('should verify instance', async () => {
    expect(teamUserRepository).toBeInstanceOf(TeamUsersRepository);
  });
});
