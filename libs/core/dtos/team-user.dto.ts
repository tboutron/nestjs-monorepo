import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Team, User } from 'libs/core/entities';

export class CreateTeamUserDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  user: User;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  team: Team;
}

export class UpdateTeamUserDto extends PartialType(CreateTeamUserDto) {}
