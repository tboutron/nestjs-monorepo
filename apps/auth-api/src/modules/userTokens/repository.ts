import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from 'libs/modules';
import { Model } from 'mongoose';

import { IUserTokensRepository } from './adapter';
import { UserToken, UserTokenDocument } from './schema';

@Injectable()
export class UserTokensRepository extends Repository<UserTokenDocument> implements IUserTokensRepository {
  constructor(@InjectModel(UserToken.name) private readonly entity: Model<UserTokenDocument>) {
    super(entity);
  }
}
