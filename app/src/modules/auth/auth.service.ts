import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { UserInterface } from '../users/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async validateUser(email: string, password: string) {
    const currentUser: UserInterface = await this.usersService.getOneByEmail(email);
    if (currentUser) {
      const isMatch: Promise<boolean> = argon2.verify(currentUser.passwordHash, password);
      if (await isMatch) {
        const { passwordHash: _password, ...result } = currentUser;
        return result;
      }
    }
    return null;
  }
}
