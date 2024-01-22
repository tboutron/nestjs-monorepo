import { Injectable } from '@nestjs/common';
import { CreateTeamDto, UpdateTeamDto } from 'libs/core/dtos';
import { TeamUser } from 'libs/core/entities';

import { ITeamsRepository, ITeamsService } from './adapter';
import { Team } from './schema';

@Injectable()
export class TeamsService implements ITeamsService {
  constructor(private readonly teamRepository: ITeamsRepository) {}

  async getAll(): Promise<Team[]> {
    return this.teamRepository.findAll();
  }

  async getById(teamId: string): Promise<Team> {
    return this.teamRepository.findById(teamId);
  }

  async create(createDto: CreateTeamDto): Promise<Team> {
    const { doc } = await this.teamRepository.create(createDto);
    return doc;
  }

  async update(teamId: string, updateDto: UpdateTeamDto): Promise<Team> {
    return this.teamRepository.updateOneById(teamId, updateDto);
  }

  async delete(teamId: string): Promise<boolean> {
    return this.teamRepository.removeById(teamId);
  }

  async addTeamUser(teamId: string, teamUser: TeamUser): Promise<Team> {
    const team = await this.getById(teamId);
    team.members.push(teamUser);
    return this.teamRepository.updateOneById(teamId, { members: team.members });
  }
}

export const TeamsServiceProvider = {
  provide: ITeamsService,
  useClass: TeamsService,
};
