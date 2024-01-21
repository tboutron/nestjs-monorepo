import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { transformSchemaOptions } from 'libs/utils/schema/transform-schema';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema(transformSchemaOptions)
export class User {
  @Prop({ unique: true, index: true })
  username: string;

  @Prop({ required: true, unique: true, lowercase: true, index: true })
  email: string;

  @Prop()
  name: string;

  @Prop({ default: Date.now() })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
