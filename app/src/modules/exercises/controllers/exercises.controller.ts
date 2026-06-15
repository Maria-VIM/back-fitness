import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ExercisesService } from '../services/exercises.service';
import { memoryStorage } from 'multer';
import { ExerciseInterface } from '../interfaces/exercise.interface';
import { ExerciseCreateDto } from '../dto/exercises/exercise-create.dto';
import { ExerciseUpdateDto } from '../dto/exercises/exercise-update.dto';
import { nanoid } from 'nanoid';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'node:fs';
import { AuthGuard } from '@nestjs/passport';
import { OwnedResource } from '../../../shared/auth/own-resource.decorator';
import { OwnsResourceGuard } from '../../../shared/auth/owns-resourse.guard';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}
  @Get()
  @UseGuards(AuthGuard('session'))
  async get(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('categoryId') categoryId?: number,
  ): Promise<ExerciseInterface[]> {
    return await this.exercisesService.get(limit, offset, categoryId);
  }

  @Get('all')
  @UseGuards(AuthGuard('session'), OwnsResourceGuard)
  async getAll(@Query('categoryId') categoryId?: number): Promise<ExerciseInterface[]> {
    return await this.exercisesService.getAll(categoryId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('session'))
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<ExerciseInterface> {
    return await this.exercisesService.getOne(id);
  }

  @Post('image')
  @OwnedResource()
  @UseGuards(AuthGuard('session'), OwnsResourceGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File): string {
    const name: string = file.originalname.split('.')[0];
    const ext: string = path.extname(file.originalname);
    const generatedName = `${name}-${nanoid(9)}${ext}`;
    const uploadDir = `./uploads/exercises/`;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath: string = path.join(uploadDir, generatedName);
    fs.writeFileSync(filePath, file.buffer);
    return generatedName;
  }

  @Post()
  @OwnedResource()
  @UseGuards(AuthGuard('session'), OwnsResourceGuard)
  async create(@Body() body: ExerciseCreateDto): Promise<ExerciseInterface> {
    return await this.exercisesService.create(body);
  }

  @Put(':id')
  @OwnedResource()
  @UseGuards(AuthGuard('session'), OwnsResourceGuard)
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: ExerciseUpdateDto): Promise<ExerciseInterface> {
    return await this.exercisesService.update(id, body);
  }

  @Delete(':id')
  @OwnedResource()
  @UseGuards(AuthGuard('session'), OwnsResourceGuard)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<ExerciseInterface> {
    return await this.exercisesService.delete(id);
  }

  @Post(':id/categories/:categoryId')
  @OwnedResource()
  @UseGuards(AuthGuard('session'), OwnsResourceGuard)
  async addCategory(
    @Param('id', ParseIntPipe) id: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<{ success: boolean }> {
    return await this.exercisesService.addCategory(id, categoryId);
  }

  @Delete(':id/categories/:categoryId')
  @OwnedResource()
  @UseGuards(AuthGuard('session'), OwnsResourceGuard)
  async deleteCategory(
    @Param('id', ParseIntPipe) id: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<{ success: boolean }> {
    return await this.exercisesService.deleteCategory(id, categoryId);
  }
}
