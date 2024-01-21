import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ITeamsService } from 'apps/teams-api/src/modules/teams/adapter';
import { CreateTeamUserDto, UpdateTeamUserDto } from 'libs/core/dtos';
import { User } from 'libs/core/entities';
import { UsersServiceMessages } from 'libs/core/services-messages';
import { firstValueFrom } from 'rxjs';

import { ITeamUsersRepository, ITeamUsersService } from './adapter';
import { TeamUser } from './schema';

@Injectable()
export class TeamUsersService implements ITeamUsersService {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    private readonly teamUserRepository: ITeamUsersRepository,
    private readonly teamsService: ITeamsService,
  ) {
    this.userServiceClient.connect();
  }

  async getAll(): Promise<TeamUser[]> {
    return this.teamUserRepository.findAll();
  }

  async listAvailableUser(searchText: string, filteredIds: Array<string>): Promise<User[]> {
    return await firstValueFrom(
      this.userServiceClient.send(UsersServiceMessages.GET_BY_NAME, {
        searchText,
        filteredIds,
      }),
    );
  }

  async getById(teamId: string): Promise<TeamUser> {
    return this.teamUserRepository.findById(teamId);
  }

  async create(createDto: CreateTeamUserDto): Promise<TeamUser> {
    const existingTeamUser = await this.teamUserRepository.findByUserAndTeam(
      createDto.user as unknown as string,
      createDto.team as unknown as string,
    );
    if (existingTeamUser) {
      throw new Error('User is already a member of the team');
    }

    const { doc } = await this.teamUserRepository.create(createDto);
    await this.teamsService.addTeamUser(createDto.team as unknown as string, doc);
    return doc;
  }

  async update(teamId: string, updateDto: UpdateTeamUserDto): Promise<TeamUser> {
    return this.teamUserRepository.updateOneById(teamId, updateDto);
  }

  async delete(teamId: string): Promise<boolean> {
    return this.teamUserRepository.removeById(teamId);
  }
}

export const TeamUsersServiceProvider = {
  provide: ITeamUsersService,
  useClass: TeamUsersService,
};
