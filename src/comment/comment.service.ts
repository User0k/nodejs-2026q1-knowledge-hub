import { Injectable } from '@nestjs/common';
import { CommentDatabase } from '../database/comment.database';
import { CommentDto } from './comment.dto';

@Injectable()
export class CommentService {
  constructor(private db: CommentDatabase) {}

  async getAll(articleId: string) {
    return this.db.getAll(articleId);
  }

  async getOne(id: string) {
    return this.db.getOne(id);
  }

  async create(commentDto: CommentDto) {
    return this.db.create(commentDto);
  }

  async delete(id: string) {
    return this.db.delete(id);
  }
}
