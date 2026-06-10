import { Injectable } from '@nestjs/common';
import { WorkoutsRepository } from '../repositpries/workouts.repository';
import { WorkoutsInterface } from '../interfaces/workouts.interface';
import { WorkoutCreateDto } from '../dto/workouts/workout-create.dto';
import { WorkoutUpdateDto } from '../dto/workouts/workout-update.dto';
import { GenerateWorkoutsCreateDto } from '../dto/workouts/generate-workouts-create.dto';

@Injectable()
export class WorkoutsService {
  constructor(private workoutsRepository: WorkoutsRepository) {}
  async get(userId: number): Promise<WorkoutsInterface[]> {
    return await this.workoutsRepository.get(userId);
  }

  async getOne(id: number): Promise<WorkoutsInterface> {
    return await this.workoutsRepository.getOne(id);
  }

  async create(userId: number, body: WorkoutCreateDto): Promise<WorkoutsInterface> {
    return await this.workoutsRepository.create(userId, body);
  }

  async generatePlan(userId: number, body: GenerateWorkoutsCreateDto): Promise<WorkoutsInterface> {
    return await this.workoutsRepository.generatePlan(userId, body);
  }

  async update(id: number, body: WorkoutUpdateDto): Promise<WorkoutsInterface> {
    return await this.workoutsRepository.update(id, body);
  }

  async delete(id: number): Promise<WorkoutsInterface> {
    return await this.workoutsRepository.delete(id);
  }
}
