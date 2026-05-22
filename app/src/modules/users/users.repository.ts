import { Inject, Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { UserInterface } from './interfaces/user.interface';
import * as argon2 from 'argon2';
import { UserCreateDto } from './dto/user-create.dto';
import { nanoid } from 'nanoid';
import { VerificationRepository } from '../verification/verification.repository';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject('pool') private pool: Pool,
    private verificationRepository: VerificationRepository,
  ) {}
  async getOne(id: number): Promise<UserInterface> {
    const user: QueryResult<UserInterface> = await this.pool.query(`SELECT * FROM users WHERE id = $1 `, [id]);
    return user.rows[0];
  }

  async getOneByEmail(email: string, isVerified: boolean): Promise<UserInterface> {
    const user: QueryResult<UserInterface> = await this.pool.query(
      `SELECT id, username, "passwordHash" FROM users WHERE email = $1 AND "isVerified" = $2`,
      [email, isVerified],
    );
    return user.rows[0];
  }

  async create(body: UserCreateDto): Promise<UserInterface> {
    const { username, birthday, email, password } = body;
    const hasVerifiedAccount: UserInterface = await this.getOneByEmail(email, true);
    if (hasVerifiedAccount) {
      throw new Error('User with this email already exists and is verified');
    }
    const hashedPassword: string = await argon2.hash(password);
    const code: string = nanoid(6);
    const hasNotVerifiedAccount: UserInterface = await this.getOneByEmail(email, false);
    const createQuery: string = `INSERT INTO users (username, birthday, email, "passwordHash", "verificationCode", "verificationCodeExpiresAt") VALUES ($1, $2, $3, $4, $5, NOW() + INTERVAL '15 minutes') RETURNING id`;
    const updateQuery: string = `UPDATE users SET username = $1, birthday = $2, "passwordHash" = $4, "verificationCode" = $5, "verificationCodeExpiresAt" = NOW() + INTERVAL '15 minutes' WHERE email = $3 RETURNING id`;
    const newUser: QueryResult<UserInterface> = await this.pool.query(
      hasNotVerifiedAccount ? updateQuery : createQuery,
      [username, birthday, email, hashedPassword, code],
    );
    await this.verificationRepository.sendVerificationEmail(email, code);
    return newUser.rows[0];
  }
}
