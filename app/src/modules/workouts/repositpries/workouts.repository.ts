import { Inject, Injectable } from '@nestjs/common';
import { Pool, PoolClient, QueryResult } from 'pg';
import { WorkoutsInterface } from '../interfaces/workouts.interface';
import { WorkoutCreateDto } from '../dto/workouts/workout-create.dto';
import { WorkoutUpdateDto } from '../dto/workouts/workout-update.dto';

@Injectable()
export class WorkoutsRepository {
  constructor(@Inject('pool') private pool: Pool) {}
  async get(userId: number): Promise<WorkoutsInterface[]> {
    const workouts: QueryResult<WorkoutsInterface> = await this.pool.query(
      `SELECT pw.id, pw.title, pwd."daysOfWeek", pw."deletedAt"
        FROM "personalWorkouts" pw 
          LEFT JOIN "personalWorkoutDays" pwd ON pwd."personalWorkoutId" = pw.id
        WHERE "userId" = $1`,
      [userId],
    );
    return workouts.rows;
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
      `UPDATE "personalWorkouts" SET "deletedAt" = current_timestamp WHERE id = $1`,
      [id],
    );
    return result.rows[0];
  }
}
