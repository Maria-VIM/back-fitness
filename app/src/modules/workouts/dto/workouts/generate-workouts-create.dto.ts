import { IsArray, IsEnum, IsString } from 'class-validator';
import { DaysOfWeek } from '../../enums/daysOfWeek.enum';

export class GenerateWorkoutsCreateDto {
  @IsString()
  title: string;

  @IsArray()
  @IsEnum(DaysOfWeek, { each: true })
  daysOfWeek: DaysOfWeek[];

  @IsArray()
  categoryIds: number[];
}
