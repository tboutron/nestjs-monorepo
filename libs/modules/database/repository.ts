import { HttpStatus } from '@nestjs/common';
import { TeamDocument } from 'apps/teams-api/src/modules/teams/schema';
import { AppApiException } from 'libs/utils';
import mongodb from 'mongodb';
import {
  AnyKeys,
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
      throw new AppApiException(`db ${this.model.db.name} disconnected`, HttpStatus.INTERNAL_SERVER_ERROR, 'Database');
  }

  async create<DocContents = AnyKeys<TeamDocument>>(document: DocContents | T): Promise<CreatedModel<T>> {
    const createdEntity = await this.model.create(document);
    return { id: createdEntity.id, created: !!createdEntity.id, doc: createdEntity };
  }

  async find(filter: FilterQuery<T>, options?: QueryOptions): Promise<T[]> {
    return await this.model.find(filter, undefined, options).populate(this.populateOnFind).exec();
  }

  async findById(id: string | number): Promise<T> {
    return (await this.model.findById(id).populate(this.populateOnFind).exec()) as never as T;
  }

  async findOne(filter: FilterQuery<T>, options?: QueryOptions): Promise<T> {
    return (await this.model.findOne(filter, undefined, options).populate(this.populateOnFind).exec()) as never as T;
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
