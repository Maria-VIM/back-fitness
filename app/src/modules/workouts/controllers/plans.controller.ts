import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { PlansService } from '../services/plans.service';
import { PlansInterface } from '../interfaces/plans.interface';
import { PlanCreateDto } from '../dto/plans/plan-create.dto';
import { PlanUpdateDto } from '../dto/plans/plan-update.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}
  @Get(':personalWorkoutId')
  @UseGuards(AuthGuard('session'))
  async get(
    @Param('personalWorkoutId', ParseIntPipe)
    personalWorkoutId: number,
  ): Promise<PlansInterface[]> {
    return this.plansService.get(personalWorkoutId);
  }

  @Get(':personalWorkoutId/position/:position')
  @UseGuards(AuthGuard('session'))
  async getOneByPosition(
    @Param('personalWorkoutId', ParseIntPipe)
    personalWorkoutId: number,
    @Param('position', ParseIntPipe)
    position: number,
  ): Promise<PlansInterface> {
    return this.plansService.getOneByPosition(personalWorkoutId, position);
  }

  @Post()
  @UseGuards(AuthGuard('session'))
  async create(@Body() body: PlanCreateDto): Promise<PlansInterface> {
    return this.plansService.create(body);
  }

  @Put(':id')
  @UseGuards(AuthGuard('session'))
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: PlanUpdateDto): Promise<PlansInterface> {
    return this.plansService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('session'))
  async delete(@Param('id', ParseIntPipe) id: number): Promise<PlansInterface> {
    return this.plansService.delete(id);
  }
}
