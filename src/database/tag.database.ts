import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

interface Tag {
  id: string;
  name: string;
}

@Injectable()
export class TagDatabase {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Tag[]> {
    return await this.prisma.tag.findMany();
  }

  async getOne(id: string): Promise<Tag | null> {
    return (
      (await this.prisma.tag.findUnique({
        where: { id },
      })) ?? null
    );
  }

  async getOneByName(name: string): Promise<Tag | null> {
    return (
      (await this.prisma.tag.findUnique({
        where: { name },
      })) ?? null
    );
  }

  async create(name: string): Promise<Tag> {
    return await this.prisma.tag.create({
      data: { name },
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.category.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
