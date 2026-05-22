import { Inject, Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { ExerciseUpdateDto } from '../dto/exercises/exercise-update.dto';
import { ExerciseCreateDto } from '../dto/exercises/exercise-create.dto';
import { ExerciseInterface } from '../interfaces/exercise.interface';

@Injectable()
export class ExercisesRepository {
  constructor(@Inject('pool') private pool: Pool) {}
  async get(limit: number, offset: number, categoryId?: number): Promise<ExerciseInterface[]> {
    const base: string = `SELECT e.id, e.title, e."imagePath", e.during, ARRAY_AGG(c.name) as categories
        FROM exercises e LEFT JOIN "exercisesCategory" ec ON e.id = ec."exerciseId" LEFT JOIN categories c ON ec."categoryId" = c.id`;
    const groupBy = ` GROUP BY e.id`;
    const limitQuery = ` LIMIT $1 OFFSET $2`;
    const where: string = categoryId ? ` WHERE c.id = $3 AND "deletedAt" IS NULL` : ' WHERE "deletedAt" IS NULL';
    const exercises: QueryResult<ExerciseInterface> = await this.pool.query(
      base + where + groupBy + limitQuery,
      categoryId ? [limit, offset, categoryId] : [limit, offset],
    );
    return exercises.rows;
  }

  async getAll(categoryId?: number): Promise<ExerciseInterface[]> {
    const base: string = `SELECT e.id, e.title, e."imagePath", e.during, ARRAY_AGG(c.name) as categories
        FROM exercises e LEFT JOIN "exercisesCategory" ec ON e.id = ec."exerciseId" LEFT JOIN categories c ON ec."categoryId" = c.id`;
    const groupBy = ` GROUP BY e.id`;
    const where: string = categoryId ? ` WHERE c.id = $1 AND "deletedAt" IS NULL` : ' WHERE "deletedAt" IS NULL';
    const exercises: QueryResult<ExerciseInterface> = await this.pool.query(
      base + where + groupBy,
      categoryId ? [categoryId] : [],
    );
    return exercises.rows;
  }

  async getOne(id: number): Promise<ExerciseInterface> {
    const exercise: QueryResult<ExerciseInterface> = await this.pool.query(
      `SELECT e.id, e.title, e."imagePath", e.content, e.during, e."createdAt", e."deletedAt",
              ARRAY_AGG(c.name) as categories, ARRAY_AGG(c.id) as "categoryIds"
              FROM exercises e
              LEFT JOIN "exercisesCategory" ec ON e.id = ec."exerciseId" 
              LEFT JOIN categories c ON ec."categoryId" = c.id
              WHERE e.id = $1
              GROUP BY e.id`,
      [id],
    );
    return exercise.rows[0];
  }
  async create(body: ExerciseCreateDto): Promise<ExerciseInterface> {
    const { title, content, imagePath, during } = body;
    const result: QueryResult<ExerciseInterface> = await this.pool.query(
      `INSERT INTO exercises (title, content, "imagePath", during) VALUES ($1, $2, $3, $4) RETURNING id`,
      [title, content, imagePath, during],
    );
    return result.rows[0];
  }
  async update(id: number, body: ExerciseUpdateDto): Promise<ExerciseInterface> {
    const { title, content, imagePath, during } = body;
    const result: QueryResult<ExerciseInterface> = await this.pool.query(
      `UPDATE exercises SET title = $1, content = $2, "imagePath" = $3, during = $4 WHERE id = $5 RETURNING id`,
      [title, content, imagePath, during, id],
    );
    return result.rows[0];
  }

  async delete(id: number): Promise<ExerciseInterface> {
    const result: QueryResult<ExerciseInterface> = await this.pool.query(
      `UPDATE exercises SET "deletedAt" = current_timestamp WHERE id = $1 RETURNING id`,
      [id],
    );
    return result.rows[0];
  }

  async addCategory(id: number, categoryId: number): Promise<{ success: boolean }> {
    const alreadyExists: QueryResult<{ id: number }> = await this.pool.query(
      `SELECT id FROM "exercisesCategory" WHERE "exerciseId" = $1 AND "categoryId" = $2`,
      [id, categoryId],
    );
    if (alreadyExists.rows.length > 0) {
      return { success: false };
    }
    await this.pool.query(`INSERT INTO "exercisesCategory" ("exerciseId","categoryId") VALUES ($1, $2)`, [
      id,
      categoryId,
    ]);
    return { success: true };
  }

  async removeCategory(id: number, categoryId: number): Promise<{ success: boolean }> {
    await this.pool.query(`DELETE FROM "exercisesCategory" WHERE "exerciseId" = $1 AND "categoryId" = $2`, [
      id,
      categoryId,
    ]);
    return { success: true };
  }
}
