import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class ExerciseCreateDto {
  @ApiProperty({
    example: 'Push Ups',
    description: 'Exercise title',
  })
  @IsString()
  @MinLength(2)
  title: string;

  @ApiProperty({
    example: 'Perform a plank position and bend and extend your arms...',
    description: 'Exercise description',
  })
  @IsString()
  content: string;

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
  })
  @Type(() => Number)
  @IsNumber()
  during: number;
}
