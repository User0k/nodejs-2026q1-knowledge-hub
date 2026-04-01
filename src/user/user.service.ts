import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto } from './user.dto';
import { UserDatabase } from './user.db';

@Injectable()
export class UserService {
  constructor(private db: UserDatabase) {}

  async getAll() {
    return this.db.getAll();
  }

  async getOne(id: string) {
    return this.db.getOne(id);
  }

  async create(userDto: CreateUserDto) {
    return this.db.create(userDto);
  }

  async updatePassword(id: string, updateDto: UpdatePasswordDto) {
    return this.db.updatePassword(id, updateDto);
  }

  async delete(id: string) {
    return this.db.delete(id);
  }
}
