import { Injectable } from '@nestjs/common';
import { VerificationRepository } from './verification.repository';

@Injectable()
export class VerificationService {
  constructor(private verificationRepository: VerificationRepository) {}
  async sendVerificationEmail(email: string, code: string) {
    await this.verificationRepository.sendVerificationEmail(email, code);
  }

  async acceptAccount(email: string, code: string) {
    await this.verificationRepository.acceptAccount(email, code);
  }
}
