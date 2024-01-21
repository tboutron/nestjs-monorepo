import { ClientProxy } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { ITeamsService } from 'apps/teams-api/src/modules/teams/adapter';
import { CreateTeamUserDto, UpdateTeamUserDto } from 'libs/core/dtos';

import { TeamEntity } from '../../teams/entity';
import { ITeamUsersRepository } from '../adapter';
import { TeamUserEntity } from '../entity';
import { TeamUser } from '../schema';
import { TeamUsersService } from '../service';

describe('TeamUsersService', () => {
  let service: TeamUsersService;
  let mockTeamUsersRepository: Partial<ITeamUsersRepository>;
  let mockTeamsService: Partial<ITeamsService>;
  let mockClientProxy: Partial<ClientProxy>;

  beforeEach(async () => {
    mockTeamUsersRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUserAndTeam: jest.fn(),
      create: jest.fn(),
      updateOneById: jest.fn(),
      removeById: jest.fn(),
    };

    mockTeamsService = {
      addTeamUser: jest.fn(),
    };

    mockClientProxy = {
      send: jest.fn(),
      connect: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        TeamUsersService,
        { provide: 'USER_SERVICE', useValue: mockClientProxy },
        { provide: ITeamUsersRepository, useValue: mockTeamUsersRepository },
        { provide: ITeamsService, useValue: mockTeamsService },
      ],
    }).compile();

    service = moduleRef.get<TeamUsersService>(TeamUsersService);
  });

  it('should return all team users', async () => {
    const teamUsers: TeamUser[] = [];
    jest.spyOn(mockTeamUsersRepository, 'findAll').mockResolvedValue(teamUsers as never);
    expect(await service.getAll()).toBe(teamUsers);
  });

  it('should return a team user by id', async () => {
    const teamUser: TeamUser = new TeamUser();
    jest.spyOn(mockTeamUsersRepository, 'findById').mockResolvedValue(teamUser as never);
    expect(await service.getById('1')).toBe(teamUser);
  });

  it('should create a new team user', async () => {
    const createDto: CreateTeamUserDto = { user: '1' as never, team: '1' as never };
    const teamUser: TeamUserEntity = new TeamUserEntity();
    // eslint-disable-next-line unicorn/no-null
    jest.spyOn(mockTeamUsersRepository, 'findByUserAndTeam').mockResolvedValue(null);
    jest
      .spyOn(mockTeamUsersRepository, 'create')
      .mockResolvedValue({ doc: teamUser as never, created: true, id: teamUser.id });
    jest.spyOn(mockTeamsService, 'addTeamUser').mockResolvedValue({} as TeamEntity);
    expect(await service.create(createDto)).toBe(teamUser);
  });

  it('should throw an error when creating a team user that already exists', async () => {
    const createDto: CreateTeamUserDto = { user: '1' as never, team: '1' as never };
    const teamUser: TeamUser = new TeamUser();
    jest.spyOn(mockTeamUsersRepository, 'findByUserAndTeam').mockResolvedValue(teamUser);
    await expect(service.create(createDto)).rejects.toThrow('User is already a member of the team');
  });

  it('should update a team user', async () => {
    const updateDto: UpdateTeamUserDto = { user: '1' as never, team: '1' as never };
    const teamUser: TeamUser = new TeamUser();
    jest.spyOn(mockTeamUsersRepository, 'updateOneById').mockResolvedValue(teamUser as never);
    expect(await service.update('1', updateDto)).toBe(teamUser);
  });

  it('should delete a team user', async () => {
    jest.spyOn(mockTeamUsersRepository, 'removeById').mockResolvedValue(true);
    expect(await service.delete('1')).toBe(true);
  });
});
