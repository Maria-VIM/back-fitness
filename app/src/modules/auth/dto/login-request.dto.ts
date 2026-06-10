import { ApiProperty } from '@nestjs/swagger';

export class LoginRequest {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Логин пользователя (email или username)',
  })
  login: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Пароль пользователя',
    minLength: 6,
  })
  password: string;
}
