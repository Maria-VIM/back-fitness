import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { WorkoutsService } from '../services/workouts.service';
import { WorkoutsInterface } from '../interfaces/workouts.interface';
import { WorkoutCreateDto } from '../dto/workouts/workout-create.dto';
import { WorkoutUpdateDto } from '../dto/workouts/workout-update.dto';
import { AuthGuard } from '@nestjs/passport';
import { GenerateWorkoutsCreateDto } from '../dto/workouts/generate-workouts-create.dto';

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

  @Get('total')
  @UseGuards(AuthGuard('session'))
  async getAllPlans(@Req() req: any): Promise<number> {
    const userId: number = Number(req.session.user?.id);
    return await this.workoutsService.getAllPlans(userId);
  }

  @Get('active/total')
  @UseGuards(AuthGuard('session'))
  async getActiveTotal(@Req() req: any): Promise<number> {
    const userId: number = Number(req.session.user?.id);
    return await this.workoutsService.getActiveTotal(userId);
  }

  @Post()
  @UseGuards(AuthGuard('session'))
  async create(@Body() body: WorkoutCreateDto, @Req() req: any): Promise<WorkoutsInterface> {
    const userId: number = Number(req.session.user?.id);
    return await this.workoutsService.create(userId, body);
  }

  @Post('generated')
  @UseGuards(AuthGuard('session'))
  async generatePlan(@Body() body: GenerateWorkoutsCreateDto, @Req() req: any): Promise<WorkoutsInterface> {
    const userId: number = Number(req.session.user?.id);
    return await this.workoutsService.generatePlan(userId, body);
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
