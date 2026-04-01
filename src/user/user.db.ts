import { Injectable } from '@nestjs/common';
import { User } from './user.interface';
import { CreateUserDto, UpdatePasswordDto } from './user.dto';
import { randomUUID } from 'node:crypto';

@Injectable()
export class UserDatabase {
  users: Map<string, User>;
  constructor() {
    this.users = new Map();
  }

  getAll(): User[] {
    return [...this.users.values()];
  }

  getOne(id: string): User | null {
    return this.users.get(id);
  }

  create(props: CreateUserDto): User {
    const id = randomUUID();
    const { login, password, role } = props;
    const createdAt = Date.now();
    const user: User = {
      id,
      login,
      password,
      role,
      createdAt,
      updatedAt: createdAt,
    };

    this.users.set(id, user);
    return user;
  }

  updatePassword(id: string, props: UpdatePasswordDto): User | null {
    const user = this.users.get(id);
    if (!user) return null;

    const newUser: User = {
      ...user,
      password: props.newPassword,
      updatedAt: Date.now(),
    };

    this.users.set(id, newUser);
    return newUser;
  }

  delete(id: string) {
    return this.users.delete(id);
  }
}
