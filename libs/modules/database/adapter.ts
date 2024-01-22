import { MongooseModuleOptions } from '@nestjs/mongoose';
import { TeamDocument } from 'apps/teams-api/src/modules/teams/schema';
import { AnyKeys, FilterQuery, QueryOptions, SaveOptions, UpdateQuery, UpdateWithAggregationPipeline } from 'mongoose';

import { ConnectionModel, CreatedModel, RemovedModels, UpdatedModel } from './types';

export abstract class IDataBaseService {
  abstract getDefaultConnection<T = MongooseModuleOptions>(options?: ConnectionModel): T;
}

export abstract class IRepository<T> {
  abstract isConnected(): Promise<void>;

  abstract create<DocContents = AnyKeys<TeamDocument>, Save = SaveOptions>(
    document: DocContents | T,
    saveOptions?: Save,
  ): Promise<CreatedModel<T>>;

  abstract findById(id: string | number): Promise<T>;

  abstract findAll(): Promise<T[]>;

  abstract find<TQuery = FilterQuery<T>, TOptions = QueryOptions<T>>(
    filter: TQuery,
    options?: TOptions | null,
  ): Promise<T[]>;

  abstract remove<TQuery = FilterQuery<T>>(filter: TQuery): Promise<RemovedModels>;

  abstract removeById(id: string | number): Promise<boolean>;

  abstract findOne<TQuery = FilterQuery<T>, TOptions = QueryOptions<T>>(filter: TQuery, options?: TOptions): Promise<T>;

  abstract updateOne<
    TQuery = FilterQuery<T>,
    TUpdate = UpdateQuery<T> | UpdateWithAggregationPipeline,
    TOptions = QueryOptions<T>,
  >(filter: TQuery, updated: TUpdate, options?: TOptions): Promise<UpdatedModel>;

  abstract updateOneById(id: string | number, updateQuery: UpdateQuery<T>, options?: QueryOptions): Promise<T>;

  abstract updateMany<
    TQuery = FilterQuery<T>,
    TUpdate = UpdateQuery<T> | UpdateWithAggregationPipeline,
    TOptions = QueryOptions<T>,
  >(filter: TQuery, updated: TUpdate, options?: TOptions): Promise<UpdatedModel>;
}
