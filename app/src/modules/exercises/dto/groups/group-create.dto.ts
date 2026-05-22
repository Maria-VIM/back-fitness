import { IsString } from 'class-validator';

export class GroupCreateDto {
  @IsString()
  name: string;
}
