import { Injectable } from '@nestjs/common';
import { GroupsRepository } from '../repositories/groups.repository';
import { GroupInterface } from '../interfaces/group.interface';
import { GroupCreateDto } from '../dto/groups/group-create.dto';
import { GroupUpdateDto } from '../dto/groups/group-update.dto';

@Injectable()
export class GroupsService {
  constructor(private groupsRepository: GroupsRepository) {}
  async get(): Promise<GroupInterface[]> {
    return this.groupsRepository.get();
  }

  async getOne(id: number): Promise<GroupInterface> {
    return this.groupsRepository.getOne(id);
  }

  async create(body: GroupCreateDto): Promise<GroupInterface> {
    return this.groupsRepository.create(body);
  }

  async update(id: number, body: GroupUpdateDto): Promise<GroupInterface> {
    return this.groupsRepository.update(id, body);
  }

  async delete(id: number): Promise<{ success: boolean }> {
    return this.groupsRepository.delete(id);
  }
}
