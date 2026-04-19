import { Controller, Get, Query, Post } from '@nestjs/common';
import { VerificationService } from './verification.service';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}
  @Post()
  async sendVerificationEmail(@Query('email') email: string, @Query('code') code: string) {
    return this.verificationService.sendVerificationEmail(email, code);
  }

  @Get()
  async acceptAccount(@Query('email') email: string, @Query('code') code: string) {
    return this.verificationService.acceptAccount(email, code);
  }
}
