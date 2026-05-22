import { Injectable } from '@nestjs/common';
import { ExercisesRepository } from '../repositories/exercises.repository';
import { ExerciseCreateDto } from '../dto/exercises/exercise-create.dto';
import { ExerciseUpdateDto } from '../dto/exercises/exercise-update.dto';
import { ExerciseInterface } from '../interfaces/exercise.interface';

@Injectable()
export class ExercisesService {
  constructor(private exercisesRepository: ExercisesRepository) {}
  async get(limit: number = 10, offset: number = 0, categoryId?: number): Promise<ExerciseInterface[]> {
    return await this.exercisesRepository.get(limit, offset, categoryId);
  }

  async getAll(categoryId?: number): Promise<ExerciseInterface[]> {
    return await this.exercisesRepository.getAll(categoryId);
  }

  async getOne(id: number): Promise<ExerciseInterface> {
    return await this.exercisesRepository.getOne(id);
  }

  async create(body: ExerciseCreateDto): Promise<ExerciseInterface> {
    return await this.exercisesRepository.create(body);
  }

  async update(id: number, body: ExerciseUpdateDto): Promise<ExerciseInterface> {
    return await this.exercisesRepository.update(id, body);
  }

  async delete(id: number): Promise<ExerciseInterface> {
    return await this.exercisesRepository.delete(id);
  }

  async addCategory(id: number, categoryId: number): Promise<{ success: boolean }> {
    return await this.exercisesRepository.addCategory(id, categoryId);
  }

  async deleteCategory(id: number, categoryId: number): Promise<{ success: boolean }> {
    return await this.exercisesRepository.removeCategory(id, categoryId);
  }
}
