import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ExerciseUpdateDto {
  @ApiProperty({
    example: 'Push Ups',
    description: 'Exercise title',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'Perform a plank position...',
    description: 'Exercise description',
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    example: '/uploads/exercises/push-ups.png',
    description: 'Path to the exercise image',
    required: false,
  })
  @IsString()
  @IsOptional()
  imagePath?: string;

  @ApiProperty({
    example: 60,
    description: 'Duration of the exercise in seconds',
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  during?: number;
}
