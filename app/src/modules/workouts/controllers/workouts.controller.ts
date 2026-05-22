import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { WorkoutsService } from '../services/workouts.service';
import { WorkoutsInterface } from '../interfaces/workouts.interface';
import { WorkoutCreateDto } from '../dto/workouts/workout-create.dto';
import { WorkoutUpdateDto } from '../dto/workouts/workout-update.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}
  @Get()
  @UseGuards(AuthGuard('session'))
  async get(@Req() req: any): Promise<WorkoutsInterface[]> {
    const userId: number = Number(req.session.user?.id);
    return await this.workoutsService.get(userId);
  }

  @Get('one/:id')
  @UseGuards(AuthGuard('session'))
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<WorkoutsInterface> {
    return await this.workoutsService.getOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('session'))
  async create(@Body() body: WorkoutCreateDto, @Req() req: any): Promise<WorkoutsInterface> {
    const userId: number = Number(req.session.user?.id);
    return await this.workoutsService.create(userId, body);
  }

  @Put(':id')
  @UseGuards(AuthGuard('session'))
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: WorkoutUpdateDto): Promise<WorkoutsInterface> {
    return await this.workoutsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('session'))
  async delete(@Param('id', ParseIntPipe) id: number): Promise<WorkoutsInterface> {
    return await this.workoutsService.delete(id);
  }
}
