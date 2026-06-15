import { Inject, Injectable } from '@nestjs/common';
import { Pool, PoolClient, QueryResult } from 'pg';
import { WorkoutsInterface } from '../interfaces/workouts.interface';
import { WorkoutCreateDto } from '../dto/workouts/workout-create.dto';
import { WorkoutUpdateDto } from '../dto/workouts/workout-update.dto';
import { ExerciseInterface } from '../../exercises/interfaces/exercise.interface';
import { EntityIsUndefined } from '../../../shared/errors/entity-is-undefined';
import { ExercisesService } from '../../exercises/services/exercises.service';
import { GenerateWorkoutsCreateDto } from '../dto/workouts/generate-workouts-create.dto';

@Injectable()
export class WorkoutsRepository {
  constructor(
    @Inject('pool') private pool: Pool,
    private exercisesService: ExercisesService,
  ) {}
  async get(userId: number): Promise<WorkoutsInterface[]> {
    const workouts: QueryResult<WorkoutsInterface> = await this.pool.query(
      `
        SELECT
          pw.id,
          pw.title,
          pwd."daysOfWeek",
          pw."deletedAt",
          EXISTS (
            SELECT 1
            FROM "workoutSessions" ws
            WHERE ws."personalWorkoutId" = pw.id
              AND DATE(ws."finishedAt") = CURRENT_DATE
          ) AS "completedToday"
        FROM "personalWorkouts" pw
               LEFT JOIN "personalWorkoutDays" pwd
                         ON pwd."personalWorkoutId" = pw.id
        WHERE pw."userId" = $1
          AND pw."deletedAt" IS NULL
      `,
      [userId],
    );
    return workouts.rows;
  }

  async getAllPlans(userId: number): Promise<number> {
    const result: QueryResult<{ total: number }> = await this.pool.query(
      `
        SELECT COUNT(*)::int AS total
        FROM "personalWorkouts" pw
        WHERE pw."userId" = $1
          AND pw."deletedAt" IS NULL
      `,
      [userId],
    );

    return result.rows[0]?.total ?? 0;
  }

  async getActiveTotal(userId: number): Promise<number> {
    const result: QueryResult<{ total: number }> = await this.pool.query(
      `
    SELECT COUNT(*)::int AS total
    FROM "personalWorkouts" pw
    LEFT JOIN "personalWorkoutDays" pwd
      ON pwd."personalWorkoutId" = pw.id
    WHERE pw."userId" = $1
      AND pw."deletedAt" IS NULL
      AND lower(trim(to_char(CURRENT_DATE, 'day'))) = ANY(pwd."daysOfWeek"::text[])
      AND NOT EXISTS (
        SELECT 1
        FROM "workoutSessions" ws
        WHERE ws."personalWorkoutId" = pw.id
          AND DATE(ws."finishedAt") = CURRENT_DATE
      )
    `,
      [userId],
    );
    return result.rows[0]?.total ?? 0;
  }

  async getOne(id: number): Promise<WorkoutsInterface> {
    const workout: QueryResult<WorkoutsInterface> = await this.pool.query(
      `SELECT pw.id, pw.title, pw."createdAt", pwd."daysOfWeek"
        FROM "personalWorkouts" pw
          LEFT JOIN "personalWorkoutDays" pwd ON pwd."personalWorkoutId" = pw.id
        WHERE pw.id = $1`,
      [id],
    );
    return workout.rows[0];
  }

  async create(userId: number, body: WorkoutCreateDto): Promise<WorkoutsInterface> {
    const { title, daysOfWeek } = body;
    const client: PoolClient = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result: QueryResult<WorkoutsInterface> = await client.query(
        `
      INSERT INTO "personalWorkouts" (title, "userId")
      VALUES ($1, $2) RETURNING *
      `,
        [title, userId],
      );
      const workout: WorkoutsInterface = result.rows[0];
      if (daysOfWeek?.length) {
        await client.query(
          `
            INSERT INTO "personalWorkoutDays"
              ("personalWorkoutId", "daysOfWeek")
            VALUES ($1, $2)
          `,
          [workout.id, daysOfWeek],
        );
      }
      await client.query('COMMIT');
      return workout;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async generatePlan(userId: number, body: GenerateWorkoutsCreateDto): Promise<WorkoutsInterface> {
    const { title, daysOfWeek, categoryIds } = body;
    const exercises: ExerciseInterface[] = await this.exercisesService.findByCategories(categoryIds, 2);
    if (!exercises.length) {
      throw new EntityIsUndefined('EXERCISES');
    }
    const count: number = Math.floor(Math.random() * 3) + 8;
    const client: PoolClient = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const workoutResult: QueryResult<WorkoutsInterface> = await client.query(
        `INSERT INTO "personalWorkouts" (title, "userId")
      VALUES ($1, $2) RETURNING *`,
        [title, userId],
      );
      const workout: WorkoutsInterface = workoutResult.rows[0];
      for (let i: number = 0; i < count; i++) {
        const exercise: ExerciseInterface = exercises[Math.floor(Math.random() * exercises.length)];
        await client.query(
          `
        INSERT INTO "planExercises"
        ("personalWorkoutId", "exerciseId", sets, reps, "orderIndex")
        VALUES ($1, $2, 1, 10, $3)
        `,
          [workout.id, exercise.id, i + 1],
        );
      }
      if (daysOfWeek?.length) {
        await client.query(
          `
            INSERT INTO "personalWorkoutDays"
              ("personalWorkoutId", "daysOfWeek")
            VALUES ($1, $2)
          `,
          [workout.id, daysOfWeek],
        );
      }
      console.log(daysOfWeek);
      await client.query('COMMIT');
      return workout;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async update(id: number, body: WorkoutUpdateDto): Promise<WorkoutsInterface> {
    const { title, daysOfWeek } = body;
    const client: PoolClient = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result: QueryResult<WorkoutsInterface> = await client.query(
        `
          UPDATE "personalWorkouts"
          SET title = COALESCE($2, title)
          WHERE id = $1
            RETURNING *
        `,
        [id, title],
      );
      const workout: WorkoutsInterface = result.rows[0];
      if (daysOfWeek !== undefined) {
        await client.query(
          `
        UPDATE "personalWorkoutDays"
        SET "daysOfWeek" = $2
        WHERE "personalWorkoutId" = $1
        `,
          [workout.id, daysOfWeek ?? []],
        );
      }
      await client.query('COMMIT');
      return workout;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(id: number): Promise<WorkoutsInterface> {
    const result: QueryResult<WorkoutsInterface> = await this.pool.query(
      `UPDATE "personalWorkouts" SET "deletedAt" = current_timestamp WHERE id = $1 RETURNING id`,
      [id],
    );
    return result.rows[0];
  }
}
