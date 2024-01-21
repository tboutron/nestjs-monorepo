import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'libs/core/entities';
import { Document, Model, Types } from 'mongoose';

export type UserTokenDocument = UserToken & Document;

export enum TokenTypeEnum {
  /**
   * Classical password, can only have one by user
   */
  PASSWORD = 'PASSWORD',

  /**
   * One-time password (send by mail for example)
   */
  OTP = 'OTP',

  /**
   * Refresh token, stored on device and valid for a time
   */
  REFRESH = 'REFRESH',
}

@Schema()
export class UserToken {
  @Prop({ type: Types.ObjectId, ref: (Model<User>).name })
  user: User;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ nullable: true })
  expireAt?: Date;

  @Prop()
  type: TokenTypeEnum;

  /**
   * PASSWORD -> email (login)
   * OTP -> secret
   * REFRESH -> refresh token
   */
  @Prop()
  key: string;

  /**
   * PASSWORD -> Bcrypt
   * All others -> NULL
   */
  @Prop({ nullable: true })
  value?: string;

  /**
   * For refresh tokens only, original token that was used
   */
  @Prop({ type: Types.ObjectId, ref: (Model<UserToken>).name, nullable: true })
  origin?: UserToken;
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);
