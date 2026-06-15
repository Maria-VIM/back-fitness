import { Inject, Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { CategoryInterface } from '../interfaces/category.interface';
import { CategoryUpdateDto } from '../dto/categories/category-update.dto';
import { CategoryCreateDto } from '../dto/categories/category-create.dto';

@Injectable()
export class CategoriesRepository {
  constructor(@Inject('pool') private pool: Pool) {}
  async get(groupId?: number): Promise<CategoryInterface[]> {
    const baseQuery: string = `SELECT c.id, c.name, c."groupId", CAST(COUNT(DISTINCT ec."exerciseId") as integer) AS using
                               FROM categories c
                                 LEFT JOIN "exercisesCategory" ec ON c.id = ec."categoryId"`;
    const groupBy: string = ` GROUP BY c.id`;
    const orderBy: string = ` ORDER BY c.id DESC`;
    const whereQuery: string = groupId ? ' WHERE c."groupId" = $1' : '';
    const categories: QueryResult<CategoryInterface> = await this.pool.query(
      baseQuery + whereQuery + groupBy + orderBy,
      groupId ? [groupId] : [],
    );
    return categories.rows;
  }

  async getOne(id: number): Promise<CategoryInterface> {
    const category: QueryResult<CategoryInterface> = await this.pool.query(
      `
        SELECT id, name, "groupId"
        FROM categories
        WHERE id = $1
        `,
      [id],
    );
    return category.rows[0];
  }

  async create(body: CategoryCreateDto): Promise<CategoryInterface> {
    const { name, groupId } = body;
    const result: QueryResult<CategoryInterface> = await this.pool.query(
      `INSERT INTO categories (name, "groupId") VALUES ($1, $2) RETURNING id`,
      [name, groupId],
    );
    return result.rows[0];
  }

  async update(id: number, body: CategoryUpdateDto): Promise<CategoryInterface> {
    const { name, groupId } = body;
    const result: QueryResult<CategoryInterface> = await this.pool.query(
      `UPDATE categories SET name = $2, "groupId" = $3 WHERE id = $1 RETURNING id`,
      [id, name, groupId],
    );
    return result.rows[0];
  }

  async delete(id: number): Promise<{ success: boolean }> {
    const currentCategory: QueryResult<{ count: number }> = await this.pool.query(
      `SELECT COUNT(*) as count FROM categories c JOIN "exercisesCategory" ec ON c.id = ec."categoryId" WHERE c.id = $1`,
      [id],
    );
    if (currentCategory.rows[0].count > 0) {
      return { success: false };
    }
    await this.pool.query(`DELETE FROM categories WHERE id = $1`, [id]);
    return { success: true };
  }
}
