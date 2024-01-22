import { IRepository } from 'libs/modules';

import { UserTokenDocument } from './schema';

export abstract class IUserTokensRepository extends IRepository<UserTokenDocument> {}
