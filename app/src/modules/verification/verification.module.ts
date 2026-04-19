import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationRepository } from './verification.repository';
import { VerificationController } from './verification.controller';

@Module({
  controllers: [VerificationController],
  providers: [VerificationService, VerificationRepository],
  exports: [VerificationRepository],
})
export class VerificationModule {}
