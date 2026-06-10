import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CategoryUpdateDto {
  @ApiProperty({
    example: 'Strength Training',
    description: 'Category name',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 1,
    description: 'Category group ID',
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  groupId?: number;
}
