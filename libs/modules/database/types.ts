import { ObjectId } from 'mongoose';

export type ConnectionModel = {
  host: string;
  port: string | number;
  user: string;
  pass: string;
  dbName: string;
};

export type UpdatedModel = {
  matchedCount: number;
  modifiedCount: number;
  acknowledged: boolean;
  upsertedId: unknown | ObjectId;
  upsertedCount: number;
};

export type RemovedModels = {
  deletedCount: number;
  deleted: boolean;
};

export type CreatedModel<T> = {
  id: string;
  created: boolean;
  doc: T;
};
