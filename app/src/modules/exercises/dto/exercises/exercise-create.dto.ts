import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ExerciseCreateDto {
  @IsString()
  title: string;
  @IsString()
  content: string;
  @IsString()
  @IsOptional()
  imagePath?: string;
  @IsNumber()
  @Type(() => Number)
  during: number;
}
