import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserInterface } from './interfaces/user.interface';
import { UserCreateDto } from './dto/user-create.dto';
import { Public } from '../../shared/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get(':id')
  async getOne(@Param('id') id: number): Promise<UserInterface> {
    return this.usersService.getOne(id);
  }

  @Public()
  @Post()
  async create(@Body() body: UserCreateDto): Promise<UserInterface> {
    return this.usersService.create(body);
  }
}
