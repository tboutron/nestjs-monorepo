import { RpcException } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from 'libs/core/dtos';

import { IUsersService } from '../adapter';
import { UsersController } from '../controller';
import { UserEntity } from '../entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: IUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: IUsersService,
          useValue: {
            getAll: jest.fn(),
            getById: jest.fn(),
            searchByName: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<IUsersService>(IUsersService);
  });

  it('should list all users', async () => {
    const result = [];
    jest.spyOn(service, 'getAll').mockResolvedValue(result);
    expect(await controller.list()).toBe(result);
  });

  it('should get user by id', async () => {
    const result = new UserEntity();
    jest.spyOn(service, 'getById').mockResolvedValue(result);
    expect(await controller.getById('1')).toBe(result);
  });

  it('should search user by name', async () => {
    const result = [];
    jest.spyOn(service, 'searchByName').mockResolvedValue(result);
    expect(await controller.searchByName({ searchText: 'John', filteredIds: ['1', '2'] })).toBe(result);
  });

  it('should create a user', async () => {
    const dto = new CreateUserDto();
    const result = new UserEntity();
    jest.spyOn(service, 'create').mockResolvedValue(result);
    expect(await controller.create(dto)).toBe(result);
  });

  it('should throw an error when creating a user with duplicate key', async () => {
    const dto = new CreateUserDto();
    jest.spyOn(service, 'create').mockRejectedValue({ code: 11_000 });
    await expect(controller.create(dto)).rejects.toThrow(RpcException);
  });

  it('should delete a user', async () => {
    jest.spyOn(service, 'delete').mockResolvedValue(true);
    expect(await controller.delete('1')).toBe(true);
  });
});
