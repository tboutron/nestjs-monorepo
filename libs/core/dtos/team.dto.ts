import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Team } from 'libs/core/entities';

export class CreateTeamDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsOptional()
  parent?: Team;
}

export class UpdateTeamDto extends PartialType(CreateTeamDto) {}
