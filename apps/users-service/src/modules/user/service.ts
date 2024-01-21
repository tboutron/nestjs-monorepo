import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'libs/core/dtos';
import { FilterQuery } from 'mongoose';

import { IUsersRepository, IUsersService } from './adapter';
import { User } from './schema';

@Injectable()
export class UsersService implements IUsersService {
  constructor(private readonly userRepository: IUsersRepository) {}

  async getAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async searchByName(searchText: string | undefined, filteredIds: Array<string>): Promise<User[]> {
    const filter: FilterQuery<User> = {
      _id: { $nin: filteredIds },
    };
    if (searchText) {
      filter.name = { $regex: searchText, $options: 'i' };
    }
    // eslint-disable-next-line unicorn/no-array-callback-reference
    return this.userRepository.find(filter);
  }

  async getById(userId: string): Promise<User> {
    return this.userRepository.findById(userId);
  }

  async create(createDto: CreateUserDto): Promise<User> {
    const { doc } = await this.userRepository.create(createDto);
    return doc;
  }

  async update(userId: string, updateDto: UpdateUserDto): Promise<User> {
    return this.userRepository.updateOneById(userId, updateDto);
  }

  async delete(userId: string): Promise<boolean> {
    return this.userRepository.removeById(userId);
  }
}
