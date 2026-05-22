import { Module } from '@nestjs/common';
import { ExercisesService } from './services/exercises.service';
import { ExercisesController } from './controllers/exercises.controller';
import { ExercisesRepository } from './repositories/exercises.repository';
import { GroupsRepository } from './repositories/groups.repository';
import { GroupsService } from './services/groups.service';
import { GroupsController } from './controllers/groups.controller';
import { CategoriesController } from './controllers/categories.controller';
import { CategoriesRepository } from './repositories/categories.repository';
import { CategoriesService } from './services/categories.service';

@Module({
  controllers: [ExercisesController, GroupsController, CategoriesController],
  providers: [
    ExercisesService,
    ExercisesRepository,
    GroupsService,
    GroupsRepository,
    CategoriesRepository,
    CategoriesService,
  ],
})
export class ExercisesModule {}
