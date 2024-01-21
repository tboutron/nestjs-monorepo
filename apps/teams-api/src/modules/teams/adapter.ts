import { TeamUserEntity } from 'apps/teams-api/src/modules/teamUsers/entity';
import { CreateTeamDto, UpdateTeamDto } from 'libs/core/dtos';
import { IRepository } from 'libs/modules';

import { Team, TeamDocument } from './schema';

export abstract class ITeamsRepository extends IRepository<TeamDocument> {}

export abstract class ITeamsService {
  abstract getAll(): Promise<Team[]>;
  abstract getById(teamId: string): Promise<Team>;
  abstract create(createDto: CreateTeamDto): Promise<Team>;
  abstract update(teamId: string, updateDto: UpdateTeamDto): Promise<Team>;
  abstract delete(teamId: string): Promise<boolean>;

  abstract addTeamUser(teamId: string, teamUser: TeamUserEntity): Promise<Team>;
}
