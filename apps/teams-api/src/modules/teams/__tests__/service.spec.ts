import { Test } from '@nestjs/testing';
import { CreateTeamDto, UpdateTeamDto } from 'libs/core/dtos';
import { Team, TeamUser } from 'libs/core/entities';

import { ITeamsRepository } from '../adapter';
import { TeamsService } from '../service';

describe('TeamsService', () => {
  let teamsService: TeamsService;
  let mockTeamsRepository: Partial<ITeamsRepository>;

  beforeEach(async () => {
    mockTeamsRepository = {
      findAll: jest.fn().mockResolvedValue([]),
      findById: jest.fn(),
      create: jest.fn().mockResolvedValue({ doc: undefined }),
      updateOneById: jest.fn(),
      removeById: jest.fn().mockResolvedValue(false),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [TeamsService, { provide: ITeamsRepository, useValue: mockTeamsRepository }],
    }).compile();

    teamsService = moduleRef.get<TeamsService>(TeamsService);
  });

  it('should return all teams', async () => {
    const result = await teamsService.getAll();
    expect(result).toEqual([]);
    expect(mockTeamsRepository.findAll).toHaveBeenCalled();
  });

  it('should return a team by id', async () => {
    const result = await teamsService.getById('1');
    expect(result).toBeUndefined();
    expect(mockTeamsRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should create a team', async () => {
    const createDto: CreateTeamDto = { name: 'Test' };
    const result = await teamsService.create(createDto);
    expect(result).toBeUndefined();
    expect(mockTeamsRepository.create).toHaveBeenCalledWith(createDto);
  });

  it('should update a team', async () => {
    const updateDto: UpdateTeamDto = { name: 'Test' };
    const result = await teamsService.update('1', updateDto);
    expect(result).toBeUndefined();
    expect(mockTeamsRepository.updateOneById).toHaveBeenCalledWith('1', updateDto);
  });

  it('should delete a team', async () => {
    const result = await teamsService.delete('1');
    expect(result).toBe(false);
    expect(mockTeamsRepository.removeById).toHaveBeenCalledWith('1');
  });

  it('should add a team user', async () => {
    const teamUser: TeamUser = { id: '1', user: undefined, team: undefined, joinedAt: new Date() };
    const team: Team = { id: '1', name: 'Test', members: [], createdAt: new Date() };
    mockTeamsRepository.findById = jest.fn().mockResolvedValue(team);
    mockTeamsRepository.updateOneById = jest.fn().mockResolvedValue({ ...team, members: [teamUser] });

    const result = await teamsService.addTeamUser('1', teamUser);
    expect(result).toEqual({ ...team, members: [teamUser] });
    expect(mockTeamsRepository.findById).toHaveBeenCalledWith('1');
    expect(mockTeamsRepository.updateOneById).toHaveBeenCalledWith('1', { members: [teamUser] });
  });
});
