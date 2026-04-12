import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CategoryDto } from '../category/category.dto';

@Injectable()
export class CategoryDatabase {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<CategoryDto[]> {
    return await this.prisma.category.findMany();
  }

  async getOne(id: string): Promise<CategoryDto | null> {
    return (
      (await this.prisma.category.findUnique({
        where: { id },
      })) ?? null
    );
  }

  async create(props: CategoryDto): Promise<CategoryDto> {
    return await this.prisma.category.create({
      data: {
        name: props.name,
        description: props.description,
      },
    });
  }

  async update(id: string, props: CategoryDto): Promise<CategoryDto | null> {
    const category = await this.prisma.category.update({
      where: { id },
      data: {
        name: props.name,
        description: props.description,
      },
    });

    return category ?? null;
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
