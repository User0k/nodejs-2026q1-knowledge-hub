import { Injectable } from '@nestjs/common';
import { CategoryDatabase } from './category.db';
import { CategoryDto } from './category.dto';

@Injectable()
export class CategoryService {
  constructor(private db: CategoryDatabase) {}

  async getAll() {
    return this.db.getAll();
  }

  async getOne(id: string) {
    return this.db.getOne(id);
  }

  async create(categoryDto: CategoryDto) {
    return this.db.create(categoryDto);
  }

  async update(id: string, categoryDto: CategoryDto) {
    const existingCategory = this.db.getOne(id);
    if (!existingCategory) {
      return null;
    }

    return this.db.update(id, categoryDto);
  }

  async delete(id: string) {
    return this.db.delete(id);
  }
}
