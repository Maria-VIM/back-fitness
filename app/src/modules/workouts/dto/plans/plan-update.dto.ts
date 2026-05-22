import { IsNumber } from 'class-validator';

export class PlanUpdateDto {
  @IsNumber()
  sets: number;
  @IsNumber()
  reps: number;
  @IsNumber()
  orderIndex: number;
}
