import { Controller, Query, Post, Put } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { Public } from '../../shared/public.decorator';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}
  @Public()
  @Post()
  async sendVerificationEmail(@Query('email') email: string, @Query('code') code: string) {
    return this.verificationService.sendVerificationEmail(email, code);
  }

  @Public()
  @Put()
  async acceptAccount(@Query('email') email: string, @Query('code') code: string) {
    return this.verificationService.acceptAccount(email, code);
  }
}
