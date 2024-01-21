import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TeamUser } from 'libs/core/entities';
import { transformSchemaOptions } from 'libs/utils/schema/transform-schema';
import mongoose, { Document } from 'mongoose';

export type TeamDocument = Team & Document;

@Schema(transformSchemaOptions)
export class Team {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'TeamUser', default: [] })
  members: Array<TeamUser>;

  @Prop({ default: Date.now() })
  createdAt: Date;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
