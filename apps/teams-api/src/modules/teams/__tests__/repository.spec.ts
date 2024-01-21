import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import { ITeamsRepository } from '../adapter';
import { TeamsRepository } from '../repository';
import { Team } from '../schema';

describe('TeamsRepository', () => {
  let teamRepository: ITeamsRepository;

  beforeEach(async () => {
    jest.clearAllMocks();
    const app = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: ITeamsRepository,
          useClass: TeamsRepository,
        },
        {
          provide: getModelToken(Team.name),
          useValue: {},
        },
      ],
    }).compile();

    teamRepository = app.get(ITeamsRepository);
  });
  test('should verify instance', async () => {
    expect(teamRepository).toBeInstanceOf(TeamsRepository);
  });
});
