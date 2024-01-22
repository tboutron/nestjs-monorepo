import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';
import { Team, User } from 'libs/core/entities';

import { TeamUser } from './schema';

export class TeamUserEntity implements TeamUser {
  id?: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  user: User;

  @ApiProperty()
  @IsNotEmpty()
  team: Team;

  @ApiProperty()
  joinedAt: Date;
  @ApiProperty()
  leavedAt?: Date;
}
