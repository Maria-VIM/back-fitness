import { IsNumber, IsString } from 'class-validator';

export class CategoryCreateDto {
  @IsString()
  name: string;
  @IsNumber()
  groupId: number;
}
