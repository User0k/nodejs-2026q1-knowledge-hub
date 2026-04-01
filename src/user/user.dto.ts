export class CreateUserDto {
  login: string;
  password: string;
  role?: 'admin' | 'editor' | 'viewer' = 'viewer';
}

export class UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
}
