import { Injectable } from '@nestjs/common';
import { PlansRepository } from '../repositpries/plans.repository';
import { PlansInterface } from '../interfaces/plans.interface';
import { PlanCreateDto } from '../dto/plans/plan-create.dto';
import { PlanUpdateDto } from '../dto/plans/plan-update.dto';

@Injectable()
export class PlansService {
  constructor(private readonly plansRepository: PlansRepository) {}
  async get(personalWorkoutId: number): Promise<PlansInterface[]> {
    return this.plansRepository.get(personalWorkoutId);
  }

  async getOne(personalWorkoutId: number, id: number): Promise<PlansInterface> {
    return this.plansRepository.getOne(personalWorkoutId, id);
  }

  async create(body: PlanCreateDto): Promise<PlansInterface> {
    return this.plansRepository.create(body);
  }

  async update(id: number, body: PlanUpdateDto): Promise<PlansInterface> {
    return this.plansRepository.update(id, body);
  }

  async delete(id: number): Promise<PlansInterface> {
    return this.plansRepository.delete(id);
  }
}
