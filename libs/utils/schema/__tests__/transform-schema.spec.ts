import { SchemaOptions } from '@nestjs/mongoose';

import { transform, transformSchemaOptions } from '../transform-schema';

describe('transform function', () => {
  it('should remove _id property from the object', () => {
    const doc = {};
    const ret = { _id: '123', name: 'test' };

    transform(doc, ret);

    expect(ret).toEqual({ name: 'test' });
  });

  it('should not throw error when _id property does not exist', () => {
    const doc = {};
    const ret = { name: 'test' };

    expect(() => transform(doc, ret as never)).not.toThrow();
  });
});

describe('transformSchemaOptions', () => {
  it('should have correct options', () => {
    const expectedOptions: SchemaOptions = {
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

    expect(transformSchemaOptions).toEqual(expectedOptions);
  });
});
