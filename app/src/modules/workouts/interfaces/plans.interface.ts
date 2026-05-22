export interface PlansInterface {
  id: number;
  personalWorkoutId: number;
  exerciseId: number;
  sets: number;
  reps: number;
  orderIndex: number;
  deletedAt: Date;
}
