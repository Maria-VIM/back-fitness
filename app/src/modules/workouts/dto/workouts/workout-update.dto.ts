import { IsArray, IsEnum, IsString } from 'class-validator';
import { DaysOfWeek } from '../../enums/daysOfWeek.enum';

export class WorkoutUpdateDto {
  @IsString()
  title: string;
  @IsArray()
  @IsEnum(DaysOfWeek, { each: true })
  daysOfWeek: DaysOfWeek[];
}
