import { CreateUserDto, UpdateUserDto } from 'libs/core/dtos';
import { IRepository } from 'libs/modules';

import { User, UserDocument } from './schema';

export abstract class IUsersService {
  abstract getAll(): Promise<User[]>;
  abstract getById(userId: string): Promise<User>;
  abstract searchByName(searchText: string, filteredIds: Array<string>): Promise<User[]>;
  abstract create(createDto: CreateUserDto): Promise<User>;
  abstract update(userId: string, updateDto: UpdateUserDto): Promise<User>;
  abstract delete(userId: string): Promise<boolean>;
}

export abstract class IUsersRepository extends IRepository<UserDocument> {}
