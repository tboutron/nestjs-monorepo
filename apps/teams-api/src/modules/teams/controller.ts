import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTeamDto } from 'libs/core/dtos';

import { ITeamsService } from './adapter';
import { TeamEntity } from './entity';
import { SwagggerResponse } from './swagger';

@Controller('teams')
@ApiTags('teams')
@ApiBearerAuth()
export class TeamsController {
  constructor(private readonly teamsService: ITeamsService) {}

  @Get()
  @ApiResponse(SwagggerResponse.list[200])
  @ApiResponse(SwagggerResponse.list[401])
  @ApiResponse(SwagggerResponse.list[500])
  async list() {
    return this.teamsService.getAll();
  }

  @Get(':id')
  @ApiResponse(SwagggerResponse.get[200])
  @ApiResponse(SwagggerResponse.get[401])
  @ApiResponse(SwagggerResponse.get[500])
  async getById(@Param('id') id: string) {
    return this.teamsService.getById(id);
  }

  @Post()
  @ApiResponse(SwagggerResponse.create[201])
  @ApiResponse(SwagggerResponse.create[401])
  @ApiResponse(SwagggerResponse.create[500])
  async create(@Body() model: CreateTeamDto): Promise<TeamEntity> {
    return this.teamsService.create(model);
  }

  @Delete(':id')
  @ApiResponse(SwagggerResponse.delete[200])
  @ApiResponse(SwagggerResponse.delete[401])
  @ApiResponse(SwagggerResponse.delete[500])
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.teamsService.delete(id);
  }
}
