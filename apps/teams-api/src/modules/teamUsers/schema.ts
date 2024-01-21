import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Team, User } from 'libs/core/entities';
import { transformSchemaOptions } from 'libs/utils/schema/transform-schema';
import mongoose, { Document } from 'mongoose';

export type TeamUserDocument = TeamUser & Document;

@Schema(transformSchemaOptions)
export class TeamUser {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true })
  team: Team;

  @Prop({ default: () => new Date() })
  joinedAt: Date;

  @Prop()
  leavedAt?: Date;
}

export const TeamUserSchema = SchemaFactory.createForClass(TeamUser);
