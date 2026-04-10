import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User } from '../user/user.interface';
import { CreateUserDto, UpdatePasswordDto } from '../user/user.dto';

@Injectable()
export class UserDatabase {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<User[]> {
    return (await this.prisma.user.findMany()).map((user) => ({
      ...user,
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt),
    }));
  }

  async getOne(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;
    return {
      ...user,
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt),
    };
  }

  async getByLogin(login: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { login },
    });

    if (!user) return null;
    return {
      ...user,
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt),
    };
  }

  async create(props: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        login: props.login,
        password: props.password,
        role: props.role,
      },
    });
    return {
      ...user,
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt),
    };
  }

  async updatePassword(
    id: string,
    props: UpdatePasswordDto,
  ): Promise<User | null> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        password: props.newPassword,
      },
    });

    if (!user) return null;
    return {
      ...user,
      createdAt: Number(user.createdAt),
      updatedAt: Number(user.updatedAt),
    };
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
