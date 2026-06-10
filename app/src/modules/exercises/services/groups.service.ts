import { Injectable } from '@nestjs/common';
import { GroupsRepository } from '../repositories/groups.repository';
import { GroupInterface } from '../interfaces/group.interface';
import { GroupCreateDto } from '../dto/groups/group-create.dto';
import { GroupUpdateDto } from '../dto/groups/group-update.dto';
import { EntityIsUndefined } from '../../../shared/errors/entity-is-undefined';

@Injectable()
export class GroupsService {
  constructor(private groupsRepository: GroupsRepository) {}
  async get(): Promise<GroupInterface[]> {
    return this.groupsRepository.get();
  }

  async getOne(id: number): Promise<GroupInterface> {
    const group: GroupInterface = await this.groupsRepository.getOne(id);
    if (!group) {
      throw new EntityIsUndefined('GROUP');
    }
    return group;
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
