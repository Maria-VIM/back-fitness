import { Injectable } from '@nestjs/common';
import { WorkoutSessionHistoryInterface } from '../interfaces/workout/workout-session-history.interface';
import { WorkoutSessionStatisticInterface } from '../interfaces/workout/workout-session-statistic.interface';
import { WorkoutSessionInterface } from '../interfaces/workout/workout-session.interface';
import { PassingRepository } from '../repositpries/passing.repository';
import { WorkoutStatistic } from '../interfaces/workout/workout-statistic.interface';

@Injectable()
export class PassingService {
  constructor(private readonly workoutSessionsRepository: PassingRepository) {}

  async get(personalWorkoutId: number): Promise<WorkoutSessionHistoryInterface[]> {
    return this.workoutSessionsRepository.get(personalWorkoutId);
  }

  async getStatistics(): Promise<WorkoutSessionStatisticInterface[]> {
    return this.workoutSessionsRepository.getStatistics();
  }

  async getStatisticsByWorkout(personalWorkoutId: number): Promise<WorkoutStatistic[]> {
    return this.workoutSessionsRepository.getStatisticsByWorkout(personalWorkoutId);
  }

  async getUserTotalSessions(userId: number): Promise<number> {
    return this.workoutSessionsRepository.getUserTotalSessions(userId);
  }

  async startPassing(personalWorkoutId: number): Promise<WorkoutSessionInterface> {
    return this.workoutSessionsRepository.startPassing(personalWorkoutId);
  }

  async endPassing(personalWorkoutId: number): Promise<WorkoutSessionInterface> {
    return this.workoutSessionsRepository.endPassing(personalWorkoutId);
  }

  async setMark(id: number, mark: number): Promise<WorkoutSessionInterface> {
    return this.workoutSessionsRepository.setMark(id, mark);
  }
}
