import { Global, Module } from '@nestjs/common';
import { OwnershipService } from './ownership.service';
import { OwnershipRepository } from './ownership.repository';
import { OwnsResourceGuard } from './owns-resourse.guard';

@Global()
@Module({
  providers: [OwnershipService, OwnsResourceGuard, OwnershipRepository],
  exports: [OwnershipService, OwnsResourceGuard],
})
export class SharedAuthModule {}
