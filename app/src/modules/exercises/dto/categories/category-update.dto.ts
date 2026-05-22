import { IsNumber, IsString } from 'class-validator';

export class CategoryUpdateDto {
  @IsString()
  name: string;
  @IsNumber()
  groupId: number;
}
