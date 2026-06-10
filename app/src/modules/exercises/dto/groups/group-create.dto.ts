import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GroupCreateDto {
  @ApiProperty({
    example: 'Upper Body',
    description: 'Group name',
  })
  @IsString()
  name: string;
}
