import { Inject, Injectable } from '@nestjs/common';
import { Pool, PoolClient, QueryResult } from 'pg';
import { PlanCreateDto } from '../dto/plans/plan-create.dto';
import { PlansInterface } from '../interfaces/plans.interface';
import { PlanUpdateDto } from '../dto/plans/plan-update.dto';

@Injectable()
export class PlansRepository {
  constructor(@Inject('pool') private pool: Pool) {}
  async get(personalWorkoutId: number): Promise<PlansInterface[]> {
    const exercises: QueryResult<PlansInterface> = await this.pool.query(
      `SELECT pe.id, e.title, e.content, e.during, e."imagePath", pe.sets, pe.reps, pe."orderIndex"
        FROM "planExercises" pe JOIN exercises e ON pe."exerciseId" = e.id 
        WHERE "personalWorkoutId" = $1 AND pe."deletedAt" IS NULL ORDER BY "orderIndex"`,
      [personalWorkoutId],
    );
    return exercises.rows;
  }

  async getOne(personalWorkoutId: number, id: number): Promise<PlansInterface> {
    const exercise: QueryResult<PlansInterface> = await this.pool.query(
      `SELECT e.title, e.content, e."imagePath", e.during, pe.sets, pe.reps, pe."orderIndex"
        FROM "planExercises" pe JOIN exercises e ON pe."exerciseId" = e.id
        WHERE "personalWorkoutId" = $1 AND pe.id = $2`,
      [personalWorkoutId, id],
    );
    return exercise.rows[0];
  }

  async create(body: PlanCreateDto): Promise<PlansInterface> {
    const { personalWorkoutId, exerciseId, sets, reps } = body;
    const total: QueryResult<{ total: number }> = await this.pool.query(
      `SELECT CAST(COUNT(id) AS integer) AS total FROM "planExercises" WHERE "personalWorkoutId" = $1 AND "deletedAt" IS NULL`,
      [personalWorkoutId],
    );
    const result: QueryResult<PlansInterface> = await this.pool.query(
      `
        INSERT INTO "planExercises"
          ("personalWorkoutId", "exerciseId", "sets", "reps", "orderIndex")
        VALUES ($1, $2, $3, $4, $5)
          RETURNING id`,
      [personalWorkoutId, exerciseId, sets, reps, total.rows[0].total + 1],
    );
    return result.rows[0];
  }

  async update(id: number, body: PlanUpdateDto): Promise<PlansInterface> {
    const client: PoolClient = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const { sets, reps, orderIndex } = body;
      const currentResult: QueryResult<PlansInterface> = await client.query(
        `SELECT * FROM "planExercises" WHERE id = $1`,
        [id],
      );
      const current: PlansInterface = currentResult.rows[0];
      const oldOrderIndex: number = current.orderIndex;
      if (oldOrderIndex !== orderIndex) {
        if (oldOrderIndex > orderIndex) {
          await client.query(
            `UPDATE "planExercises" SET "orderIndex" = "orderIndex" + 1
          WHERE "orderIndex" >= $1
            AND "orderIndex" < $2
            AND id != $3
          `,
            [orderIndex, oldOrderIndex, id],
          );
        } else {
          await client.query(
            `UPDATE "planExercises" SET "orderIndex" = "orderIndex" - 1
          WHERE "orderIndex" <= $1
            AND "orderIndex" > $2
            AND id != $3
          `,
            [orderIndex, oldOrderIndex, id],
          );
        }
      }
      const result: QueryResult<PlansInterface> = await client.query(
        `
      UPDATE "planExercises"
      SET sets = $1, reps = $2, "orderIndex" = $3
      WHERE id = $4
      RETURNING *
      `,
        [sets, reps, orderIndex, id],
      );
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(id: number): Promise<PlansInterface> {
    const client: PoolClient = await this.pool.connect();
    try {
      const currentResult: QueryResult<PlansInterface> = await client.query(
        `SELECT * FROM "planExercises" WHERE id = $1`,
        [id],
      );
      const current: PlansInterface = currentResult.rows[0];
      await client.query(
        `UPDATE "planExercises" SET "orderIndex" = "orderIndex" - 1 WHERE "personalWorkoutId" = $1
        AND "orderIndex" > $2
        AND "deletedAt" IS NULL
      `,
        [current.personalWorkoutId, current.orderIndex],
      );
      const result: QueryResult<PlansInterface> = await this.pool.query(
        `UPDATE "planExercises" SET "deletedAt" = current_timestamp, "orderIndex" = 0 WHERE id = $1`,
        [id],
      );
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
