import { Body, Controller, Param } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { CreateUserDto } from 'libs/core/dtos';
import { UsersServiceMessages } from 'libs/core/services-messages';

import { IUsersService } from './adapter';
import { UserEntity } from './entity';

@Controller()
export class UsersController {
  constructor(private readonly usersService: IUsersService) {}

  @MessagePattern(UsersServiceMessages.LIST)
  async list() {
    return this.usersService.getAll();
  }

  @MessagePattern(UsersServiceMessages.GET)
  async getById(@Param('id') id: string) {
    return this.usersService.getById(id);
  }

  @MessagePattern(UsersServiceMessages.GET_BY_NAME)
  async searchByName({ searchText, filteredIds }: { searchText?: string; filteredIds: Array<string> }) {
    return this.usersService.searchByName(searchText, filteredIds);
  }

  @MessagePattern(UsersServiceMessages.CREATE)
  async create(@Body() model: CreateUserDto): Promise<UserEntity> {
    try {
      return await this.usersService.create(model);
    } catch (error) {
      if (error.code === 11_000) {
        // MongoDB duplicate key error code
        throw new RpcException('Duplicate key error');
      }
      throw error;
    }
  }

  @MessagePattern(UsersServiceMessages.DELETE)
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.usersService.delete(id);
  }
}
