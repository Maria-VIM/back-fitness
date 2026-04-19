import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserCreateDto } from './dto/user-create.dto';
import { UserInterface } from './interfaces/user-interface';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}
  async getOne(id: number): Promise<UserInterface> {
    return this.userRepository.getOne(id);
  }

  async create(body: UserCreateDto): Promise<UserInterface> {
    return this.userRepository.create(body);
  }
}
