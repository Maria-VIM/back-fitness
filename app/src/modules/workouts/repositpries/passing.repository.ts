import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class PassingRepository {
  constructor(@Inject('pool') private pool: Pool) {}
  async startPassing(personalWorkoutId: number) {}
  async endPassing(personalWorkoutId: number) {}
}
