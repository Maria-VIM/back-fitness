import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import {ExercisesRepository} from "./exercises.repository";

@Module({
  controllers: [ExercisesController],
  providers: [ExercisesService, ExercisesRepository],
})
export class ExercisesModule {}
