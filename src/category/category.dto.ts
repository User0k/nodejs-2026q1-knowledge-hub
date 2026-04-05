import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CategoryDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
