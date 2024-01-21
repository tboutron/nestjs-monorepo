import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ICatsRepository } from './adapter';
import { CatsEntity } from './entity';
import { SwagggerResponse } from './swagger';

@Controller('cats')
@ApiTags('cats')
@ApiBearerAuth()
export class CatsController {
  constructor(private readonly catRepository: ICatsRepository) {}

  @Post()
  @ApiResponse(SwagggerResponse.save[201])
  @ApiResponse(SwagggerResponse.save[401])
  @ApiResponse(SwagggerResponse.save[500])
  async save(@Body() model: CatsEntity): Promise<CatsEntity> {
    const { doc } = await this.catRepository.create(model);
    return doc;
  }
}
