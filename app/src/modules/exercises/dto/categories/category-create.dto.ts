import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CategoryCreateDto {
  @ApiProperty({
    example: 'Strength Training',
    description: 'Name of the training category (e.g. strength, cardio)',
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 1,
    description: 'ID of the category group (e.g. upper body, lower body, cardio, etc.)',
  })
  @Type(() => Number)
  @IsNumber()
  groupId: number;
}
