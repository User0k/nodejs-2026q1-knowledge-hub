import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Comment } from '../comment/comment.interface';
import { CommentDto } from '../comment/comment.dto';

@Injectable()
export class CommentDatabase {
  constructor(private prisma: PrismaService) {}

  async getAll(articleId: string): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      where: { articleId },
    });
    return comments.map((comment) => ({
      ...comment,
      createdAt: Number(comment.createdAt),
    }));
  }

  async getOne(id: string): Promise<Comment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) return null;
    return {
      ...comment,
      createdAt: Number(comment.createdAt),
    };
  }

  async create(props: CommentDto): Promise<Comment> {
    const comment = await this.prisma.comment.create({
      data: {
        content: props.content,
        articleId: props.articleId,
        authorId: props.authorId,
      },
    });
    return {
      ...comment,
      createdAt: Number(comment.createdAt),
    };
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.comment.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
