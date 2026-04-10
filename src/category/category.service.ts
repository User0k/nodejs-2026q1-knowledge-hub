import { Injectable } from '@nestjs/common';
import { CategoryDatabase } from '../database/category.database';
import { CategoryDto } from './category.dto';
import { ArticleDatabase } from '../database/article.database';

@Injectable()
export class CategoryService {
  constructor(
    private db: CategoryDatabase,
    private articleDb: ArticleDatabase,
  ) {}

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
    const existingCategory = await this.db.getOne(id);
    if (!existingCategory) {
      return null;
    }

    return this.db.update(id, categoryDto);
  }

  async delete(id: string) {
    this.articleDb.setCategoryIdToNull(id);
    return this.db.delete(id);
  }
}
