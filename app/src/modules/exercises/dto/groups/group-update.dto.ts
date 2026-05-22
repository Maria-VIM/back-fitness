import { IsString } from 'class-validator';

export class GroupUpdateDto {
  @IsString()
  name: string;
}
