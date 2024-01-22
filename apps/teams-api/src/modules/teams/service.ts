import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTeamDto, UpdateTeamDto } from 'libs/core/dtos';
import { TeamUser } from 'libs/core/entities';
import { AppApiException } from 'libs/utils';

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
    const parentTeamId = createDto.parent as never as string | undefined;
    if (parentTeamId) {
      await this.assertParentTeamExists(parentTeamId);
    }

    const { doc } = await this.teamRepository.create(createDto);
    return doc;
  }

  async update(teamId: string, updateDto: UpdateTeamDto): Promise<Team> {
    const parentTeamId = updateDto.parent as never as string | undefined;

    if (parentTeamId) {
      if (teamId === parentTeamId) {
        throw new AppApiException('Team cannot be its own parent', HttpStatus.PRECONDITION_FAILED);
      }

      await this.assertParentTeamExists(parentTeamId);
    }

    return this.teamRepository.updateOneById(teamId, updateDto, { new: true });
  }

  async delete(teamId: string): Promise<boolean> {
    return this.teamRepository.removeById(teamId);
  }

  async addTeamUser(teamId: string, teamUser: TeamUser): Promise<Team> {
    const team = await this.getById(teamId);
    team.members.push(teamUser);
    return this.teamRepository.updateOneById(teamId, { members: team.members }, { new: true });
  }

  private async assertParentTeamExists(parentTeamId: string): Promise<void> {
    const parentTeam = await this.teamRepository.findById(parentTeamId);
    if (!parentTeam) {
      throw new AppApiException(`Parent team with id ${parentTeamId} not found`, HttpStatus.NOT_FOUND);
    }
  }
}

export const TeamsServiceProvider = {
  provide: ITeamsService,
  useClass: TeamsService,
};
