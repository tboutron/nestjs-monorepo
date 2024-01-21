import { HttpStatus } from '@nestjs/common';
import { ApiException } from 'libs/utils';
import mongodb from 'mongodb';
import {
  Document,
  FilterQuery,
  Model,
  MongooseQueryOptions,
  QueryOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';

import { IRepository } from './adapter';
import { CreatedModel, RemovedModels, UpdatedModel } from './types';

export class Repository<T extends Document> implements IRepository<T> {
  constructor(
    protected readonly model: Model<T>,
    protected populateOnFind: Array<string> = [],
  ) {}

  async isConnected(): Promise<void> {
    if (this.model.db.readyState !== 1)
      throw new ApiException(`db ${this.model.db.name} disconnected`, HttpStatus.INTERNAL_SERVER_ERROR, 'Database');
  }

  async create(document: Partial<T>): Promise<CreatedModel<T>> {
    const createdEntity = await this.model.create(document);
    return { id: createdEntity.id, created: !!createdEntity.id, doc: createdEntity };
  }

  async find(filter: FilterQuery<T>, options?: QueryOptions): Promise<T[]> {
    return await this.model.find(filter, undefined, options).populate(this.populateOnFind).exec();
  }

  async findById(id: string | number): Promise<T> {
    return (await this.model
      .findById(id)
      .populate(this.populateOnFind as Array<string>)
      .exec()) as never as T;
  }

  async findOne(filter: FilterQuery<T>, options?: QueryOptions): Promise<T> {
    return this.model.findOne(filter, undefined, options);
  }

  async findAll(): Promise<T[]> {
    return this.model.find().populate(this.populateOnFind).exec();
  }

  async remove(filter: FilterQuery<T>): Promise<RemovedModels> {
    const { deletedCount } = await this.model.deleteMany(filter);
    return { deletedCount, deleted: !!deletedCount };
  }

  async removeById(id: string | number): Promise<boolean> {
    const deleteResult = await this.model.findByIdAndDelete(id);
    return !!deleteResult;
  }

  async updateOne(
    filter: FilterQuery<T>,
    updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
    options?: (mongodb.UpdateOptions & Omit<MongooseQueryOptions<T>, 'lean'>) | null,
  ): Promise<UpdatedModel> {
    return await this.model.updateOne(filter, updated, options);
  }

  async updateOneById(id: string | number, updateQuery: UpdateQuery<T>, options?: QueryOptions): Promise<T> {
    return await this.model.findByIdAndUpdate(id, updateQuery, options);
  }

  async updateMany(
    filter: FilterQuery<T>,
    updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
    options?: (mongodb.UpdateOptions & Omit<MongooseQueryOptions<T>, 'lean'>) | null,
  ): Promise<UpdatedModel> {
    return await this.model.updateMany(filter, updated, options);
  }
}
