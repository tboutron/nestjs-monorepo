import { SchemaOptions } from '@nestjs/mongoose';

function transform(doc, ret: { _id: unknown }) {
  delete ret._id;
}

export const transformSchemaOptions: SchemaOptions = {
  toObject: {
    virtuals: true,
    versionKey: false,
    transform,
  },
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform,
  },
};
