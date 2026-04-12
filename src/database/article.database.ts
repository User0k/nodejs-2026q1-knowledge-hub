import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Article, ArticleFilters } from '../article/article.interface';
import { ArticleDto } from '../article/article.dto';
import { Tag } from '@prisma/client';

@Injectable()
export class ArticleDatabase {
  constructor(private prisma: PrismaService) {}

  async getAll(filters?: ArticleFilters): Promise<Article[]> {
    const where: any = {};

    if (filters) {
      if (filters.status) {
        where.status = filters.status;
      }
      if (filters.categoryId) {
        where.categoryId = filters.categoryId;
      }
      if (filters.tag) {
        where.tags = {
          some: {
            name: filters.tag,
          },
        };
      }
    }

    const articles = await this.prisma.article.findMany({
      where,
      include: { tags: true },
    });

    return articles.map((article) => this.articleToResponse(article));
  }

  async getOne(id: string): Promise<Article | null> {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: { tags: true },
    });

    if (!article) return null;

    return this.articleToResponse(article);
  }

  async create(props: ArticleDto): Promise<Article> {
    const tags = props.tags || [];

    const tagConnectOrCreate = tags.map((tagName) => ({
      where: { name: tagName },
      create: { name: tagName },
    }));

    const article = await this.prisma.article.create({
      data: {
        title: props.title,
        content: props.content,
        status: props.status,
        authorId: props.authorId ?? null,
        categoryId: props.categoryId ?? null,
        tags: {
          connectOrCreate: tagConnectOrCreate,
        },
      },
      include: { tags: true },
    });

    return this.articleToResponse(article);
  }

  async update(id: string, props: ArticleDto): Promise<Article | null> {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) return null;

    const tags = props.tags || [];
    const tagConnectOrCreate = tags.map((tagName) => ({
      where: { name: tagName },
      create: { name: tagName },
    }));

    const updatedArticle = await this.prisma.article.update({
      where: { id },
      data: {
        title: props.title,
        content: props.content,
        status: props.status,
        authorId: props.authorId ?? null,
        categoryId: props.categoryId ?? null,
        tags: {
          set: [],
          connectOrCreate: tagConnectOrCreate,
        },
      },
      include: { tags: true },
    });

    return this.articleToResponse(updatedArticle);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.article.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async findByAuthorId(authorId: string): Promise<Article[]> {
    const articles = await this.prisma.article.findMany({
      where: { authorId },
      include: {
        tags: true,
      },
    });

    return articles.map((article) => this.articleToResponse(article));
  }

  async findByCategoryId(categoryId: string): Promise<Article[]> {
    const articles = await this.prisma.article.findMany({
      where: { categoryId },
      include: { tags: true },
    });

    return articles.map((article) => this.articleToResponse(article));
  }

  private articleToResponse(
    articleToModify: Omit<Article, 'tags' | 'createdAt' | 'updatedAt'> & {
      tags: Tag[];
      createdAt: Date;
      updatedAt: Date;
    },
  ): Article {
    return {
      ...articleToModify,
      tags: articleToModify.tags.map((tag) => tag.name),
      createdAt: Number(articleToModify.createdAt),
      updatedAt: Number(articleToModify.updatedAt),
    };
  }
}
