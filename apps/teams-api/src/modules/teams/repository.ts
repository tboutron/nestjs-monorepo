import { Injectable } from '@nestjs/common';
import { getConnectionToken, InjectModel } from '@nestjs/mongoose';
import { Repository } from 'libs/modules';
import { ConnectionName } from 'libs/modules/database/enum';
import { Connection, Model } from 'mongoose';

import { ITeamsRepository } from './adapter';
import { Team, TeamDocument, TeamSchema } from './schema';

@Injectable()
export class TeamsRepository extends Repository<TeamDocument> implements ITeamsRepository {
  constructor(
    @InjectModel(Team.name) private readonly entity: Model<TeamDocument>,
    protected populateOnFind: Array<keyof Team> = [],
  ) {
    super(entity, populateOnFind);
  }
}

export const TeamsRepositoryProvider = {
  provide: ITeamsRepository,
  useFactory: (connection: Connection) =>
    new TeamsRepository(connection.model<TeamDocument>(Team.name, TeamSchema), ['members']),
  inject: [getConnectionToken(ConnectionName.TEAM)],
};
