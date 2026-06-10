import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../repositories/categories.repository';
import { CategoryCreateDto } from '../dto/categories/category-create.dto';
import { CategoryInterface } from '../interfaces/category.interface';
import { CategoryUpdateDto } from '../dto/categories/category-update.dto';
import { EntityIsUndefined } from '../../../shared/errors/entity-is-undefined';

@Injectable()
export class CategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}
  async get(groupId?: number): Promise<CategoryInterface[]> {
    return this.categoriesRepository.get(groupId);
  }

  async getOne(id: number): Promise<CategoryInterface> {
    const category: CategoryInterface = await this.categoriesRepository.getOne(id);
    if (!category) {
      throw new EntityIsUndefined('CATEGORY');
    }
    return category;
  }

  async create(body: CategoryCreateDto): Promise<CategoryInterface> {
    return this.categoriesRepository.create(body);
  }

  async update(id: number, body: CategoryUpdateDto): Promise<CategoryInterface> {
    return this.categoriesRepository.update(id, body);
  }

  async delete(id: number): Promise<{ success: boolean }> {
    return this.categoriesRepository.delete(id);
  }
}
