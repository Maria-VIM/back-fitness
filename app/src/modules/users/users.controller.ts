import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserInterface } from './interfaces/user.interface';
import { UserCreateDto } from './dto/user-create.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get(':id')
  async getOne(@Param('id') id: number): Promise<UserInterface> {
    const user: UserInterface = await this.usersService.getOne(id);
    if (!user) {
      throw new NotFoundException('User dont found');
    }
    return user;
  }

  @Post()
  async create(@Body() body: UserCreateDto): Promise<UserInterface> {
    return this.usersService.create(body);
  }
}
