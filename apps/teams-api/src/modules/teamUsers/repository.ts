import { Injectable } from '@nestjs/common';
import { getConnectionToken, InjectModel } from '@nestjs/mongoose';
import { Repository } from 'libs/modules';
import { ConnectionName } from 'libs/modules/database/enum';
import { Connection, Model } from 'mongoose';

import { ITeamUsersRepository } from './adapter';
import { TeamUser, TeamUserDocument, TeamUserSchema } from './schema';

@Injectable()
export class TeamUsersRepository extends Repository<TeamUserDocument> implements ITeamUsersRepository {
  constructor(
    @InjectModel(TeamUser.name) private readonly entity: Model<TeamUserDocument>,
    protected populateOnFind: Array<keyof TeamUser> = [],
  ) {
    super(entity, populateOnFind);
  }

  async findByUserAndTeam(userId: string, teamId: string): Promise<TeamUserDocument | undefined> {
    return this.model.findOne({ user: userId, team: teamId }).populate(this.populateOnFind).exec();
  }
}

export const TeamUsersRepositoryProvider = {
  provide: ITeamUsersRepository,
  useFactory: (connection: Connection) =>
    new TeamUsersRepository(connection.model<TeamUserDocument>(TeamUser.name, TeamUserSchema), ['team']),
  inject: [getConnectionToken(ConnectionName.TEAM)],
};
