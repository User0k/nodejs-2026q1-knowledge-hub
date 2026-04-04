import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Article, ArticleFilters } from '../article/article.interface';
import { ArticleDto } from '../article/article.dto';

@Injectable()
export class ArticleDatabase {
  articles: Map<string, Article>;
  constructor() {
    this.articles = new Map();
  }

  getAll(filters?: ArticleFilters): Article[] {
    let articles = [...this.articles.values()];

    if (filters) {
      if (filters.status) {
        articles = articles.filter((a) => a.status === filters.status);
      }
      if (filters.categoryId) {
        articles = articles.filter((a) => a.categoryId === filters.categoryId);
      }
      if (filters.tag) {
        articles = articles.filter((a) => a.tags.includes(filters.tag));
      }
    }

    return articles;
  }

  getOne(id: string): Article | null {
    return this.articles.get(id);
  }

  create(props: ArticleDto): Article {
    const id = randomUUID();
    const { content, title, authorId, categoryId, status, tags } = props;
    const createdAt = Date.now();
    const article: Article = {
      id,
      content,
      title,
      authorId,
      categoryId,
      status,
      tags,
      createdAt,
      updatedAt: createdAt,
    };

    this.articles.set(id, article);
    return article;
  }

  update(id: string, props: ArticleDto): Article | null {
    const article = this.articles.get(id);
    if (!article) return null;

    const newArticle: Article = {
      ...article,
      ...props,
      updatedAt: Date.now(),
    };

    this.articles.set(id, newArticle);
    return newArticle;
  }

  delete(id: string) {
    return this.articles.delete(id);
  }

  findByAuthorId(authorId: string): Article[] {
    return [...this.articles.values()].filter((a) => a.authorId === authorId);
  }

  setAuthorIdToNull(authorId: string) {
    this.articles.forEach((article, id) => {
      if (article.authorId === authorId) {
        this.articles.set(id, {
          ...article,
          authorId: null,
          updatedAt: Date.now(),
        });
      }
    });
  }

  findByCategoryId(categoryId: string): Article[] {
    return [...this.articles.values()].filter(
      (a) => a.categoryId === categoryId,
    );
  }

  setCategoryIdToNull(categoryId: string) {
    this.articles.forEach((article, id) => {
      if (article.categoryId === categoryId) {
        this.articles.set(id, {
          ...article,
          categoryId: null,
          updatedAt: Date.now(),
        });
      }
    });
  }
}
