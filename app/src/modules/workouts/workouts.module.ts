import { Module } from '@nestjs/common';
import { WorkoutsService } from './services/workouts.service';
import { WorkoutsController } from './controllers/workouts.controller';
import { WorkoutsRepository } from './repositpries/workouts.repository';
import { PlansController } from './controllers/plans.controller';
import { PlansService } from './services/plans.service';
import { PlansRepository } from './repositpries/plans.repository';
import { ExercisesModule } from '../exercises/exercises.module';
import { PassingService } from './services/passing.service';
import { PassingRepository } from './repositpries/passing.repository';
import { PassingController } from './controllers/passing.controller';

@Module({
  controllers: [WorkoutsController, PlansController, PassingController],
  providers: [WorkoutsService, WorkoutsRepository, PlansService, PlansRepository, PassingService, PassingRepository],
  imports: [ExercisesModule],
})
export class WorkoutsModule {}
