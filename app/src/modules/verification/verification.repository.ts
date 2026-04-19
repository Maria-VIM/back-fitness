import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { transporter } from './config/email';
import { Pool, QueryResult } from 'pg';

@Injectable()
export class VerificationRepository {
  constructor(@Inject('pool') private pool: Pool) {}
  async sendVerificationEmail(email: string, code: string): Promise<void> {
    try {
      await transporter.sendMail({
        from: `${process.env.SMTP_USER}`,
        to: `${email}`,
        subject: 'Registration in Wellness Fitness',
        text: `Hi, it's your code for registration -> ${code}`,
        html: `Hi, it's your code for registration -> <b>${code}</b>`,
      });
    } catch (error) {
      console.log('Error while sending mail:', error);
    }
  }

  async acceptAccount(email: string, code: string) {
    const accepted: QueryResult<{ id: number; verificationCodeExpiresAt: Date }> = await this.pool.query(
      `SELECT id, "verificationCodeExpiresAt" FROM users WHERE email = $1 AND "verificationCode" = $2`,
      [email, code],
    );
    if (!accepted.rows.length) {
      throw new NotFoundException();
    }
    if (Date.now() > new Date(accepted.rows[0].verificationCodeExpiresAt).getTime()) {
      throw new NotFoundException('Verification code has expired');
    }
    await this.pool.query(`UPDATE users SET "isVerified" = true WHERE id = $1 RETURNING id`, [accepted.rows[0].id]);
    return accepted.rows[0];
  }
}
