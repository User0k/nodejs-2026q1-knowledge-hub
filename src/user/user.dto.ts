import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { UserRole } from './user.interface';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.VIEWER;
}

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  login: string;

  @Expose()
  role: string;

  @Expose()
  createdAt: number;

  @Expose()
  updatedAt: number;

  @Exclude()
  password: string;
}
