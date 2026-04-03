import { Injectable } from '@nestjs/common';
import { ArticleDatabase, ArticleFilters } from './article.db';
import { ArticleDto } from './article.dto';

@Injectable()
export class ArticleService {
  constructor(private db: ArticleDatabase) {}

  async getAll(filters?: ArticleFilters) {
    return this.db.getAll(filters);
  }

  async getOne(id: string) {
    return this.db.getOne(id);
  }

  async create(articleDto: ArticleDto) {
    return this.db.create(articleDto);
  }

  async update(id: string, updateDto: ArticleDto) {
    const article = this.db.getOne(id);
    if (!article) {
      return null;
    }
    return this.db.update(id, updateDto);
  }

  async delete(id: string) {
    return this.db.delete(id);
  }
}
