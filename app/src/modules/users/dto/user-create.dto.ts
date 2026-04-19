import { IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UserCreateDto {
  @IsString()
  username: string;
  @Type(() => Date)
  @IsDate()
  birthday: Date;
  @IsString()
  email: string;
  @IsString()
  password: string;
}
