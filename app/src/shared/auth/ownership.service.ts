import { Injectable } from '@nestjs/common';
import { OwnershipRepository } from './ownership.repository';

@Injectable()
export class OwnershipService {
  constructor(private readonly ownershipRepository: OwnershipRepository) {}
  async ownsAdminPermission(userId: string): Promise<boolean> {
    return this.ownershipRepository.ownAdminPermission(userId);
  }
}
