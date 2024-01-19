import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatedModel, Repository } from 'libs/modules';
import { Model } from 'mongoose';

import { IUserRepository } from './adapter';
import { User, UserDocument } from './schema';

@Injectable()
export class UserRepository extends Repository<UserDocument> implements IUserRepository {
  constructor(@InjectModel(User.name) private readonly entity: Model<UserDocument>) {
    super(entity);
  }

  async create(document: Partial<UserDocument>): Promise<CreatedModel<UserDocument>> {
    const createdEntity = await this.model.create(document);

    return { id: createdEntity.id, created: !!createdEntity.id, doc: createdEntity };
  }
}
