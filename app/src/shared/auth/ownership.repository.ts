import { Inject, Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';

@Injectable()
export class OwnershipRepository {
  constructor(@Inject('pool') private readonly pool: Pool) {}
  async ownAdminPermission(userId: string): Promise<boolean> {
    const result: QueryResult<{ ok: boolean }> = await this.pool.query(
      `
        SELECT EXISTS( SELECT 1 FROM users WHERE user_id = $1 AND "isAdmin" == true) AS ok`,
      [userId],
    );
    return result.rows[0]?.ok === true;
  }
}
