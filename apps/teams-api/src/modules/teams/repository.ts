import { Injectable } from '@nestjs/common';
import { getConnectionToken, InjectModel } from '@nestjs/mongoose';
import { CreatedModel, Repository } from 'libs/modules';
import { ConnectionName } from 'libs/modules/database/enum';
import { AnyKeys, Connection, Model } from 'mongoose';

import { ITeamsRepository } from './adapter';
import { Team, TeamDocument, TeamSchema } from './schema';

@Injectable()
export class TeamsRepository extends Repository<TeamDocument> implements ITeamsRepository {
  constructor(@InjectModel(Team.name) private readonly entity: Model<TeamDocument>) {
    super(entity, ['members', 'parent']);
  }

  async create<DocContents = AnyKeys<TeamDocument>>(
    document: DocContents | TeamDocument,
  ): Promise<CreatedModel<TeamDocument>> {
    const createdEntity = await this.model.create(document);
    return { id: createdEntity.id, created: !!createdEntity.id, doc: createdEntity };
  }
}

export const TeamsRepositoryProvider = {
  provide: ITeamsRepository,
  useFactory: (connection: Connection) => new TeamsRepository(connection.model<TeamDocument>(Team.name, TeamSchema)),
  inject: [getConnectionToken(ConnectionName.TEAM)],
};
