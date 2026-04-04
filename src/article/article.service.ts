import { Injectable } from '@nestjs/common';
import { ArticleDatabase } from '../database/article.database';
import { ArticleDto } from './article.dto';
import { ArticleFilters } from './article.interface';
import { CommentDatabase } from '../database/comment.database';

@Injectable()
export class ArticleService {
  constructor(
    private db: ArticleDatabase,
    private commentDb: CommentDatabase,
  ) {}

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
    this.commentDb.deleteByArticleId(id);
    return this.db.delete(id);
  }
}
