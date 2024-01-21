import { Test } from '@nestjs/testing';
import { CreateUserDto, UpdateUserDto } from 'libs/core/dtos';

import { IUsersRepository } from '../adapter';
import { UserEntity } from '../entity';
import { UsersService } from '../service';

const fakeUsers: UserEntity[] = [
  { id: '1', name: 'John Doe', username: 'johndoe', email: 'john.doe@mail.net', createdAt: new Date() },
  { id: '2', name: 'Jane Doe', username: 'janedoe', email: 'jane.doe@mail.net', createdAt: new Date() },
];
describe('UsersService', () => {
  let usersService: UsersService;
  let mockUserRepository: Partial<IUsersRepository>;

  beforeEach(async () => {
    mockUserRepository = {
      findAll: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateOneById: jest.fn(),
      removeById: jest.fn(),
    };

    const app = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: IUsersRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    usersService = app.get(UsersService);
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      (mockUserRepository.findAll as jest.Mock).mockResolvedValue(fakeUsers);

      const result = await usersService.getAll();

      expect(result).toEqual(fakeUsers);
    });
  });

  describe('searchByName', () => {
    it('should return users matching the search text', async () => {
      const expectedUser: UserEntity[] = [fakeUsers[0]];
      (mockUserRepository.find as jest.Mock).mockResolvedValue(expectedUser);

      const result = await usersService.searchByName('John', []);

      expect(result).toEqual(expectedUser);
    });
  });

  describe('getById', () => {
    it('should return the user with the given id', async () => {
      const expectedUser: UserEntity[] = [fakeUsers[0]];
      (mockUserRepository.findById as jest.Mock).mockResolvedValue(expectedUser);

      const result = await usersService.getById('1');

      expect(result).toEqual(expectedUser);
    });
  });

  describe('create', () => {
    it('should create a new user and return it', async () => {
      const createUserDto: CreateUserDto = { name: 'John Doe' } as CreateUserDto;
      const expectedUser: UserEntity[] = [fakeUsers[0]];
      (mockUserRepository.create as jest.Mock).mockResolvedValue({ doc: expectedUser });

      const result = await usersService.create(createUserDto);

      expect(result).toEqual(expectedUser);
    });
  });

  describe('update', () => {
    it('should update the user with the given id and return it', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Jane Doe' };
      const expectedUser: UserEntity = { id: '1', name: 'Jane Doe' } as UserEntity;
      (mockUserRepository.updateOneById as jest.Mock).mockResolvedValue(expectedUser);

      const result = await usersService.update('1', updateUserDto);

      expect(result).toEqual(expectedUser);
    });
  });

  describe('delete', () => {
    it('should delete the user with the given id and return true', async () => {
      (mockUserRepository.removeById as jest.Mock).mockResolvedValue(true);

      const result = await usersService.delete('1');

      expect(result).toEqual(true);
    });
  });
});
