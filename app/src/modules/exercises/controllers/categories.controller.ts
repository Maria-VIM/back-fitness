import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CategoryCreateDto } from '../dto/categories/category-create.dto';
import { CategoryUpdateDto } from '../dto/categories/category-update.dto';
import { CategoryInterface } from '../interfaces/category.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Get()
  @UseGuards(AuthGuard('session'))
  async get(@Query('groupId') groupId?: number): Promise<CategoryInterface[]> {
    return this.categoriesService.get(groupId);
  }

  @Get(`:id`)
  @UseGuards(AuthGuard('session'))
  async getOne(@Param('id') id: number): Promise<CategoryInterface> {
    return this.categoriesService.getOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('session'))
  async create(@Body() createDto: CategoryCreateDto): Promise<CategoryInterface> {
    return this.categoriesService.create(createDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('session'))
  async update(@Param('id') id: number, @Body() updateDto: CategoryUpdateDto): Promise<CategoryInterface> {
    return this.categoriesService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('session'))
  @HttpCode(204)
  async delete(@Param('id') id: number): Promise<HttpStatus> {
    const deleted: { success: boolean } = await this.categoriesService.delete(id);
    if (!deleted.success) {
      throw new ConflictException('resource could not be deleted');
    }
    return HttpStatus.NO_CONTENT;
  }
}
