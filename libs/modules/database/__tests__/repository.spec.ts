import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Connection, Document, Model, model } from 'mongoose';

import { IRepository } from '../adapter';
import { Repository } from '../repository';
import { CreatedModel } from '../types';

type EntityDummyDocument = EntityDummy & Document;
@Schema()
class EntityDummy {}
const EntityDummySchema = SchemaFactory.createForClass(EntityDummy);

const buildMock = (dummyEntityModel: Model<EntityDummyDocument>) => {
  const repository: IRepository<EntityDummy> = new Repository<EntityDummyDocument>(dummyEntityModel);
  return repository;
};

describe('Repository', () => {
  const DummyEntity: Model<EntityDummyDocument> = model<EntityDummyDocument>('EntityDummy', EntityDummySchema);

  describe('create', () => {
    test('should create successfully', async () => {
      const created = { id: '<id>' };

      const repository = buildMock(DummyEntity);
      jest.spyOn(DummyEntity, 'create').mockResolvedValueOnce(created as never);

      await expect(repository.create({})).resolves.toEqual({
        created: true,
        id: '<id>',
        doc: created,
      });
    });

    test.each([undefined, ''])('should create unsuccessfully', async (id) => {
      const notCreated = { id: id, __v: 0 };

      const repository = buildMock(DummyEntity);
      jest.spyOn(DummyEntity, 'create').mockResolvedValueOnce(notCreated as never);

      await expect(repository.create({})).resolves.toEqual({
        created: false,
        id: id,
        doc: notCreated,
      } as CreatedModel<unknown>);
    });
  });

  describe('find', () => {
    test('should find successfully', async () => {
      const repository = buildMock(DummyEntity);
      jest.spyOn(DummyEntity, 'find').mockResolvedValueOnce(true as never);

      await expect(repository.find({})).resolves.toEqual(true);
      DummyEntity.db;
    });
  });

  describe('isConnected', () => {
    test('should isConnected successfully', async () => {
      const repository = buildMock(DummyEntity);
      DummyEntity.db = { readyState: 1 } as Connection;

      await expect(repository.isConnected()).resolves.toBeUndefined();
    });

    test('should throw disconnected error', async () => {
      const repository = buildMock(DummyEntity);
      DummyEntity.db = { readyState: 0, name: 'mock' } as Connection;
      await expect(repository.isConnected()).rejects.toThrow('db mock disconnected');
    });
  });

  describe('findAll', () => {
    test('should findAll successfully', async () => {
      const repository = buildMock(DummyEntity);
      jest.spyOn(DummyEntity, 'find').mockResolvedValueOnce(true as never);

      await expect(repository.findAll()).resolves.toEqual(true);
    });
  });

  describe('findById', () => {
    test('should findById successfully', async () => {
      const repository = buildMock(DummyEntity);
      jest.spyOn(DummyEntity, 'findById').mockResolvedValueOnce(true);

      await expect(repository.findById('dummy')).resolves.toEqual(true);
    });
  });

  describe('findOne', () => {
    test('should findOne successfully', async () => {
      const repository = buildMock(DummyEntity);
      jest.spyOn(DummyEntity, 'findOne').mockResolvedValueOnce(true);

      await expect(repository.findOne({} as unknown)).resolves.toEqual(true);
    });
  });

  describe('remove', () => {
    test('should remove successfully', async () => {
      const repository = buildMock(DummyEntity);
      jest.spyOn(DummyEntity, 'deleteMany').mockResolvedValueOnce({
        deletedCount: 1,
      } as never);

      await expect(repository.remove({})).resolves.toEqual({ deleted: true, deletedCount: 1 });
    });

    test('should remove unsuccessfully', async () => {
      const repository = buildMock(DummyEntity);
      jest.spyOn(DummyEntity, 'deleteMany').mockResolvedValueOnce({
        deletedCount: 0,
      } as never);

      await expect(repository.remove({})).resolves.toEqual({ deleted: false, deletedCount: 0 });
    });
  });

  describe('updateOne', () => {
    test('should update successfully', async () => {
      const repository = buildMock(DummyEntity);
      jest.spyOn(DummyEntity, 'updateOne').mockResolvedValueOnce(true as never);

      await expect(repository.updateOne({}, {})).resolves.toEqual(true);
    });
  });

  describe('updateMany', () => {
    test('should update successfully', async () => {
      const repository = buildMock(DummyEntity);
      jest.spyOn(DummyEntity, 'updateMany').mockResolvedValueOnce(true as never);

      await expect(repository.updateMany({}, {})).resolves.toEqual(true);
    });
  });
});
