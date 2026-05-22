import { IsNumber } from 'class-validator';

export class PlanCreateDto {
  @IsNumber()
  personalWorkoutId: number;
  @IsNumber()
  exerciseId: number;
  @IsNumber()
  sets: number;
  @IsNumber()
  reps: number;
}
