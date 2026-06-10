import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GroupUpdateDto {
  @ApiProperty({
    example: 'Upper Body',
    description: 'Group name',
  })
  @IsString()
  name: string;
}
