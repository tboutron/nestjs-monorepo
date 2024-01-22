import { ApiProperty } from '@nestjs/swagger';

import { Cats } from './schema';

export class CatsEntity implements Cats {
  id?: string;

  @ApiProperty({ description: 'Cats name', example: 'SuperCat' })
  name: string;

  @ApiProperty({ description: 'Cats age', example: 4.2 })
  age: number;

  @ApiProperty({ description: 'Cats breed', example: 'Some bread' })
  breed: string;
}
