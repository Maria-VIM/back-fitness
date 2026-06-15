import { Inject, Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { GroupInterface } from '../interfaces/group.interface';
import { GroupCreateDto } from '../dto/groups/group-create.dto';
import { GroupUpdateDto } from '../dto/groups/group-update.dto';

@Injectable()
export class GroupsRepository {
  constructor(@Inject('pool') private pool: Pool) {}
  async get(): Promise<GroupInterface[]> {
    const groups: QueryResult<GroupInterface> = await this.pool.query(`
        SELECT g.id, g.name, CAST(COUNT(DISTINCT c.id) as integer) as using
        FROM groups g LEFT JOIN categories c ON g.id = c."groupId"
        GROUP BY g.id
        ORDER BY g.id DESC`);
    return groups.rows;
  }

  async getOne(id: number): Promise<GroupInterface> {
    const group: QueryResult<GroupInterface> = await this.pool.query(
      `
        SELECT id, name
        FROM groups WHERE id = $1`,
      [id],
    );
    return group.rows[0];
  }

  async create(body: GroupCreateDto): Promise<GroupInterface> {
    const { name } = body;
    const result: QueryResult<GroupInterface> = await this.pool.query(
      `INSERT INTO groups (name) VALUES ($1) RETURNING id`,
      [name],
    );
    return result.rows[0];
  }

  async update(id: number, body: GroupUpdateDto): Promise<GroupInterface> {
    const { name } = body;
    const result: QueryResult<GroupInterface> = await this.pool.query(
      `UPDATE groups SET name = $2 WHERE id = $1 RETURNING id`,
      [id, name],
    );
    return result.rows[0];
  }

  async delete(id: number): Promise<{ success: boolean }> {
    const currentGroup: QueryResult<{ count: number }> = await this.pool.query(
      `SELECT COUNT(c.id) as count FROM groups g JOIN categories c ON g.id = c."groupId"  WHERE g.id = $1`,
      [id],
    );
    if (currentGroup.rows[0].count > 0) {
      return { success: false };
    }
    await this.pool.query(`DELETE FROM groups WHERE id = $1`, [id]);
    return { success: true };
  }
}
