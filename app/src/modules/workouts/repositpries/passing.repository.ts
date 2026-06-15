import { Inject, Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { WorkoutSessionInterface } from '../interfaces/workout/workout-session.interface';
import { WorkoutSessionHistoryInterface } from '../interfaces/workout/workout-session-history.interface';
import { WorkoutSessionStatisticInterface } from '../interfaces/workout/workout-session-statistic.interface';
import { WorkoutStatistic } from '../interfaces/workout/workout-statistic.interface';

@Injectable()
export class PassingRepository {
  constructor(@Inject('pool') private pool: Pool) {}

  async get(personalWorkoutId: number): Promise<WorkoutSessionHistoryInterface[]> {
    const result: QueryResult<WorkoutSessionHistoryInterface> = await this.pool.query(
      `
          SELECT
            id,
            mark,
            "startedAt"
          FROM "workoutSessions"
          WHERE "personalWorkoutId" = $1
          ORDER BY "startedAt" DESC
        `,
      [personalWorkoutId],
    );

    return result.rows;
  }

  async getStatisticsByWorkout(personalWorkoutId: number): Promise<WorkoutStatistic[]> {
    const result: QueryResult<WorkoutStatistic> = await this.pool.query(
      `
        SELECT
          DATE(ws."startedAt")::text AS date,
          COUNT(*)::integer AS total
        FROM "workoutSessions" ws
        WHERE ws."personalWorkoutId" = $1
        GROUP BY DATE(ws."startedAt")
        ORDER BY DATE(ws."startedAt")
      `,
      [personalWorkoutId],
    );
    return result.rows;
  }

  async getUserTotalSessions(userId: number): Promise<number> {
    const result: QueryResult<{ total: number }> = await this.pool.query(
      `
      SELECT COUNT(*)::integer AS total
      FROM "workoutSessions" ws
      INNER JOIN "personalWorkouts" pw
        ON pw.id = ws."personalWorkoutId"
      WHERE pw."userId" = $1
    `,
      [userId],
    );
    return result.rows[0].total;
  }

  async getStatistics(): Promise<WorkoutSessionStatisticInterface[]> {
    const result: QueryResult<WorkoutSessionStatisticInterface> = await this.pool.query(
      `
        SELECT
          DATE("startedAt")::text AS date,
          COUNT(*)::integer AS total
        FROM "workoutSessions"
        GROUP BY DATE("startedAt")
        ORDER BY DATE("startedAt") DESC
      `,
    );

    return result.rows;
  }

  async startPassing(personalWorkoutId: number): Promise<WorkoutSessionInterface> {
    const result: QueryResult<WorkoutSessionInterface> = await this.pool.query(
      `
          INSERT INTO "workoutSessions"
            ("personalWorkoutId", "startedAt")
          VALUES ($1, current_timestamp)
          RETURNING *
        `,
      [personalWorkoutId],
    );

    return result.rows[0];
  }

  async endPassing(personalWorkoutId: number): Promise<WorkoutSessionInterface> {
    const result: QueryResult<WorkoutSessionInterface> = await this.pool.query(
      `
          UPDATE "workoutSessions"
          SET "finishedAt" = current_timestamp
          WHERE id = (
            SELECT id
            FROM "workoutSessions"
            WHERE "personalWorkoutId" = $1
              AND "finishedAt" IS NULL
            ORDER BY id DESC
            LIMIT 1
            )
            RETURNING *
        `,
      [personalWorkoutId],
    );

    return result.rows[0];
  }

  async setMark(id: number, mark: number): Promise<WorkoutSessionInterface> {
    const result: QueryResult<WorkoutSessionInterface> = await this.pool.query(
      `
          UPDATE "workoutSessions"
          SET mark = $1
          WHERE id = $2
          RETURNING *
        `,
      [mark, id],
    );
    return result.rows[0];
  }
}
