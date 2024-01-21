import { Test, TestingModule } from '@nestjs/testing';
import { CreateTeamUserDto } from 'libs/core/dtos';

import { ITeamsService } from '../../teams/adapter';
import { ITeamUsersService } from '../adapter';
import { TeamUsersController } from '../controller';
import { TeamUserEntity } from '../entity';

describe('TeamUsersController', () => {
  let controller: TeamUsersController;
  let teamUsersService: ITeamUsersService;
  let teamsService: ITeamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamUsersController],
      providers: [
        {
          provide: ITeamUsersService,
          useValue: {
            getAll: jest.fn(),
            getById: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            listAvailableUser: jest.fn(),
          },
        },
        {
          provide: ITeamsService,
          useValue: {
            getById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TeamUsersController>(TeamUsersController);
    teamUsersService = module.get<ITeamUsersService>(ITeamUsersService);
    teamsService = module.get<ITeamsService>(ITeamsService);
  });

  it('should list all team users', async () => {
    const result = [];
    jest.spyOn(teamUsersService, 'getAll').mockResolvedValue(result);
    expect(await controller.list()).toBe(result);
  });

  it('should get team user by id', async () => {
    const result = new TeamUserEntity();
    jest.spyOn(teamUsersService, 'getById').mockResolvedValue(result);
    expect(await controller.getById('1')).toBe(result);
  });

  it('should list available users for a team', async () => {
    const result = [];
    const team = { members: [{ user: '1' }, { user: '2' }] };
    jest.spyOn(teamsService, 'getById').mockResolvedValue(team as never);
    jest.spyOn(teamUsersService, 'listAvailableUser').mockResolvedValue(result);
    expect(await controller.listAvailableUser('1', 'John')).toBe(result);
  });

  it('should create a team user', async () => {
    const dto = new CreateTeamUserDto();
    const result = new TeamUserEntity();
    jest.spyOn(teamUsersService, 'create').mockResolvedValue(result);
    expect(await controller.create(dto)).toBe(result);
  });

  it('should delete a team user', async () => {
    jest.spyOn(teamUsersService, 'delete').mockResolvedValue(true);
    expect(await controller.delete('1')).toBe(true);
  });
});
