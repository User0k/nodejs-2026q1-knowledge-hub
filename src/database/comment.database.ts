import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Comment } from '../comment/comment.interface';
import { CommentDto } from '../comment/comment.dto';

@Injectable()
export class CommentDatabase {
  comments: Map<string, Comment>;
  constructor() {
    this.comments = new Map();
  }

  getAll(articleId: string): Comment[] {
    return [...this.comments.values()].filter((c) => c.articleId === articleId);
  }

  getOne(id: string): Comment | null {
    return this.comments.get(id);
  }

  create(props: CommentDto): Comment {
    const id = randomUUID();
    const { content, articleId, authorId } = props;
    const createdAt = Date.now();
    const comment: Comment = {
      id,
      content,
      articleId,
      authorId,
      createdAt,
    };

    this.comments.set(id, comment);
    return comment;
  }

  delete(id: string) {
    return this.comments.delete(id);
  }

  deleteByAuthorId(authorId: string) {
    this.comments.forEach((comment, id) => {
      if (comment.authorId === authorId) {
        this.comments.delete(id);
      }
    });
  }

  deleteByArticleId(articleId: string) {
    this.comments.forEach((comment, id) => {
      if (comment.articleId === articleId) {
        this.comments.delete(id);
      }
    });
  }
}
