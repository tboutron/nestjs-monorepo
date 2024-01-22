import { CreateTeamUserDto, UpdateTeamUserDto } from 'libs/core/dtos';
import { User } from 'libs/core/entities';
import { IRepository } from 'libs/modules';

import { TeamUser, TeamUserDocument } from './schema';

export abstract class ITeamUsersRepository extends IRepository<TeamUserDocument> {
  abstract findByUserAndTeam(userId: string, teamId: string): Promise<TeamUser | undefined>;
}

export abstract class ITeamUsersService {
  abstract getAll(): Promise<TeamUser[]>;
  abstract getById(teamUserId: string): Promise<TeamUser>;
  abstract create(createDto: CreateTeamUserDto): Promise<TeamUser>;
  abstract update(teamUserId: string, updateDto: UpdateTeamUserDto): Promise<TeamUser>;
  abstract delete(teamUserId: string): Promise<boolean>;

  abstract listAvailableUser(searchText: string, filteredIds: Array<string>): Promise<User[]>;
}
