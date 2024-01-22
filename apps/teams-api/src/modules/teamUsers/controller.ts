import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TeamUserEntity } from 'apps/teams-api/src/modules/teamUsers/entity';
import { CreateTeamUserDto } from 'libs/core/dtos';
import { User } from 'libs/core/entities';

import { ITeamsService } from '../teams/adapter';
import { ITeamUsersService } from './adapter';
import { SwaggerResponse } from './swagger';

@Controller('team-users')
@ApiTags('team-users')
@ApiBearerAuth()
export class TeamUsersController {
  constructor(
    private readonly teamsService: ITeamsService,
    private readonly teamUsersService: ITeamUsersService,
  ) {}

  @Get()
  @ApiResponse(SwaggerResponse.list[200])
  @ApiResponse(SwaggerResponse.list[401])
  @ApiResponse(SwaggerResponse.list[500])
  async list() {
    return this.teamUsersService.getAll();
  }

  @Post('available/:teamId')
  @ApiQuery({
    name: 'searchText',
    type: String,
    description: 'User name to search for',
    required: false,
  })
  async listAvailableUser(@Param('teamId') teamId: string, @Query('searchText') searchText?: string): Promise<User[]> {
    const team = await this.teamsService.getById(teamId);
    return this.teamUsersService.listAvailableUser(
      searchText,
      team.members.map((m) => m.user as never as string),
    );
  }

  @Get(':id')
  @ApiResponse(SwaggerResponse.get[200])
  @ApiResponse(SwaggerResponse.get[401])
  @ApiResponse(SwaggerResponse.get[500])
  async getById(@Param('id') id: string) {
    return this.teamUsersService.getById(id);
  }

  @Post()
  @ApiResponse(SwaggerResponse.create[201])
  @ApiResponse(SwaggerResponse.create[401])
  @ApiResponse(SwaggerResponse.create[500])
  async create(@Body() model: CreateTeamUserDto): Promise<TeamUserEntity> {
    return this.teamUsersService.create(model);
  }

  @Delete(':id')
  @ApiResponse(SwaggerResponse.delete[200])
  @ApiResponse(SwaggerResponse.delete[401])
  @ApiResponse(SwaggerResponse.delete[500])
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.teamUsersService.delete(id);
  }
}
