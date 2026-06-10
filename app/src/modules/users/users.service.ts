import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserCreateDto } from './dto/user-create.dto';
import { UserInterface } from './interfaces/user.interface';
import { EntityIsUndefined } from '../../shared/errors/entity-is-undefined';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}
  async getOne(id: number): Promise<UserInterface> {
    return this.userRepository.getOne(id);
  }

  async getOneByEmail(email: string): Promise<UserInterface> {
    const user: UserInterface = await this.userRepository.getOneByEmail(email, true);
    if (!user) {
      throw new EntityIsUndefined('USER');
    }
    return user;
  }

  async create(body: UserCreateDto): Promise<UserInterface> {
    return this.userRepository.create(body);
  }
}
