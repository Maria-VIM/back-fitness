import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PassingService } from '../services/passing.service';
import { WorkoutSessionHistoryInterface } from '../interfaces/workout/workout-session-history.interface';
import { WorkoutSessionStatisticInterface } from '../interfaces/workout/workout-session-statistic.interface';
import { WorkoutSessionInterface } from '../interfaces/workout/workout-session.interface';
import { WorkoutStatistic } from '../interfaces/workout/workout-statistic.interface';

@Controller('workout')
export class PassingController {
  constructor(private readonly passingService: PassingService) {}

  @Get('passing/statistics')
  @UseGuards(AuthGuard('session'))
  async getStatistics(): Promise<WorkoutSessionStatisticInterface[]> {
    return await this.passingService.getStatistics();
  }

  @Get('passing/statistics/:personalWorkoutId')
  @UseGuards(AuthGuard('session'))
  async getStatisticsByWorkout(
    @Param('personalWorkoutId', ParseIntPipe) personalWorkoutId: number,
  ): Promise<WorkoutStatistic[]> {
    return await this.passingService.getStatisticsByWorkout(personalWorkoutId);
  }

  @Get('session/total')
  @UseGuards(AuthGuard('session'))
  async getUserTotalSessions(@Req() req: any): Promise<number> {
    const userId: number = Number(req.session.user?.id);
    return await this.passingService.getUserTotalSessions(userId);
  }

  @Get('passing/:personalWorkoutId')
  @UseGuards(AuthGuard('session'))
  async get(
    @Param('personalWorkoutId', ParseIntPipe) personalWorkoutId: number,
  ): Promise<WorkoutSessionHistoryInterface[]> {
    return await this.passingService.get(personalWorkoutId);
  }

  @Post('passing/start/:personalWorkoutId')
  @UseGuards(AuthGuard('session'))
  async startPassing(
    @Param('personalWorkoutId', ParseIntPipe) personalWorkoutId: number,
  ): Promise<WorkoutSessionInterface> {
    return await this.passingService.startPassing(personalWorkoutId);
  }

  @Post('passing/end/:personalWorkoutId')
  @UseGuards(AuthGuard('session'))
  async endPassing(
    @Param('personalWorkoutId', ParseIntPipe) personalWorkoutId: number,
  ): Promise<WorkoutSessionInterface> {
    return await this.passingService.endPassing(personalWorkoutId);
  }

  @Put('passing/mark/:id')
  @UseGuards(AuthGuard('session'))
  async setMark(
    @Param('id', ParseIntPipe) id: number,
    @Body('mark', ParseIntPipe) mark: number,
  ): Promise<WorkoutSessionInterface> {
    return await this.passingService.setMark(id, mark);
  }
}
