import { Module } from '@nestjs/common';
import { WorkoutsService } from './services/workouts.service';
import { WorkoutsController } from './controllers/workouts.controller';
import { WorkoutsRepository } from './repositpries/workouts.repository';
import { PlansController } from './controllers/plans.controller';
import { PlansService } from './services/plans.service';
import { PlansRepository } from './repositpries/plans.repository';
import { ExercisesModule } from '../exercises/exercises.module';

@Module({
  controllers: [WorkoutsController, PlansController],
  providers: [WorkoutsService, WorkoutsRepository, PlansService, PlansRepository],
  imports: [ExercisesModule],
})
export class WorkoutsModule {}
