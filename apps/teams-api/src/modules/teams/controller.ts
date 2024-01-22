import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTeamDto, UpdateTeamDto } from 'libs/core/dtos';

import { ITeamsService } from './adapter';
import { TeamEntity } from './entity';
import { SwaggerResponse } from './swagger';

@Controller('teams')
@ApiTags('teams')
@ApiBearerAuth()
export class TeamsController {
  constructor(private readonly teamsService: ITeamsService) {}

  @Get()
  @ApiResponse(SwaggerResponse.list[200])
  @ApiResponse(SwaggerResponse.list[401])
  @ApiResponse(SwaggerResponse.list[500])
  async list() {
    return this.teamsService.getAll();
  }

  @Get(':id')
  @ApiResponse(SwaggerResponse.get[200])
  @ApiResponse(SwaggerResponse.get[401])
  @ApiResponse(SwaggerResponse.get[500])
  async getById(@Param('id') id: string) {
    return this.teamsService.getById(id);
  }

  @Post()
  @ApiResponse(SwaggerResponse.create[201])
  @ApiResponse(SwaggerResponse.create[401])
  @ApiResponse(SwaggerResponse.create[500])
  async create(@Body() model: CreateTeamDto): Promise<TeamEntity> {
    return this.teamsService.create(model);
  }

  @Delete(':id')
  @ApiResponse(SwaggerResponse.delete[200])
  @ApiResponse(SwaggerResponse.delete[401])
  @ApiResponse(SwaggerResponse.delete[500])
  async delete(@Param('id') id: string): Promise<boolean> {
    return this.teamsService.delete(id);
  }

  @Patch(':id')
  @ApiResponse(SwaggerResponse.patch[200])
  @ApiResponse(SwaggerResponse.patch[401])
  @ApiResponse(SwaggerResponse.patch[500])
  async patch(@Param('id') id: string, @Body() model: UpdateTeamDto): Promise<TeamEntity> {
    return this.teamsService.update(id, model);
  }
}
