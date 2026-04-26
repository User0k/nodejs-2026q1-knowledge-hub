import { Test, TestingModule } from '@nestjs/testing';
import { ArticleDatabase } from './article.database';
import { PrismaService } from './prisma.service';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ArticleDto } from '../article/article.dto';
import { ArticleStatus } from '../article/article.interface';

describe('ArticleDatabase', () => {
  let db: ArticleDatabase;
  let prismaMock: any;

  const mockDate = new Date('2026-01-01T00:00:00Z');
  const mockArticle = {
    id: 'test-article-123',
    title: 'Test Article',
    content: 'Test content',
    status: ArticleStatus.DRAFT,
    authorId: 'test-user-id',
    categoryId: 'test-category-id',
    tags: [{ id: 'tag1', name: 'test' }],
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  const expectedResponse = {
    ...mockArticle,
    tags: ['test'],
    createdAt: mockDate.getTime(),
    updatedAt: mockDate.getTime(),
  };

  beforeEach(async () => {
    prismaMock = {
      article: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleDatabase,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    db = module.get<ArticleDatabase>(ArticleDatabase);
  });

  it('should be defined', () => expect(db).toBeDefined());

  describe('getAll', () => {
    it('returns all articles with converted timestamps', async () => {
      prismaMock.article.findMany.mockResolvedValue([mockArticle]);
      const result = await db.getAll();
      expect(result).toEqual([expectedResponse]);
      expect(prismaMock.article.findMany).toHaveBeenCalledWith({
        where: {},
        include: { tags: true },
      });
    });

    it('returns empty array when no articles', async () => {
      prismaMock.article.findMany.mockResolvedValue([]);
      expect(await db.getAll()).toEqual([]);
    });

    it('filters by status only', async () => {
      prismaMock.article.findMany.mockResolvedValue([]);
      await db.getAll({ status: ArticleStatus.PUBLISHED });
      expect(prismaMock.article.findMany).toHaveBeenCalledWith({
        where: { status: ArticleStatus.PUBLISHED },
        include: { tags: true },
      });
    });

    it('filters by categoryId only', async () => {
      prismaMock.article.findMany.mockResolvedValue([]);
      await db.getAll({ categoryId: 'cat-1' });
      expect(prismaMock.article.findMany).toHaveBeenCalledWith({
        where: { categoryId: 'cat-1' },
        include: { tags: true },
      });
    });

    it('filters by tag only', async () => {
      prismaMock.article.findMany.mockResolvedValue([]);
      await db.getAll({ tag: 'js' });
      expect(prismaMock.article.findMany).toHaveBeenCalledWith({
        where: { tags: { some: { name: 'js' } } },
        include: { tags: true },
      });
    });

    it('combines multiple filters', async () => {
      prismaMock.article.findMany.mockResolvedValue([]);
      await db.getAll({
        status: ArticleStatus.PUBLISHED,
        categoryId: 'cat-1',
        tag: 'js',
      });
      expect(prismaMock.article.findMany).toHaveBeenCalledWith({
        where: {
          status: ArticleStatus.PUBLISHED,
          categoryId: 'cat-1',
          tags: { some: { name: 'js' } },
        },
        include: { tags: true },
      });
    });
  });

  describe('getOne', () => {
    it('returns article by id', async () => {
      prismaMock.article.findUnique.mockResolvedValue(mockArticle);
      const result = await db.getOne('test-article-123');
      expect(result).toEqual(expectedResponse);
    });

    it('returns null if not found', async () => {
      prismaMock.article.findUnique.mockResolvedValue(null);
      expect(await db.getOne('missing')).toBeNull();
    });
  });

  describe('create', () => {
    it('creates article with tags', async () => {
      const dto: ArticleDto = {
        title: 'New',
        content: 'Content',
        tags: ['tech'],
        authorId: 'user-1',
        categoryId: 'cat-1',
      };
      const created = {
        ...mockArticle,
        title: 'New',
        tags: [{ name: 'tech' }],
      };
      prismaMock.article.create.mockResolvedValue(created);
      const result = await db.create(dto);
      expect(result.tags).toEqual(['tech']);
      expect(prismaMock.article.create).toHaveBeenCalledWith({
        data: {
          title: 'New',
          content: 'Content',
          status: undefined,
          authorId: 'user-1',
          categoryId: 'cat-1',
          tags: {
            connectOrCreate: [
              { where: { name: 'tech' }, create: { name: 'tech' } },
            ],
          },
        },
        include: { tags: true },
      });
    });

    it('handles missing tags (undefined -> empty array)', async () => {
      const dto: ArticleDto = { title: 'No Tags', content: 'Content' };
      prismaMock.article.create.mockResolvedValue({
        ...mockArticle,
        title: 'No Tags',
        tags: [],
      });
      await db.create(dto);
      expect(prismaMock.article.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ tags: { connectOrCreate: [] } }),
        include: { tags: true },
      });
    });

    it('handles optional authorId and categoryId as null', async () => {
      const dto: ArticleDto = { title: 'Test', content: 'Content' };
      prismaMock.article.create.mockResolvedValue({
        ...mockArticle,
        title: 'Test',
      });
      await db.create(dto);
      expect(prismaMock.article.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ authorId: null, categoryId: null }),
        include: { tags: true },
      });
    });
  });

  describe('update', () => {
    it('updates article and replaces tags', async () => {
      const dto: ArticleDto = {
        title: 'Updated',
        content: 'New content',
        tags: ['new'],
      };
      prismaMock.article.findUnique.mockResolvedValue(mockArticle);
      const updated = {
        ...mockArticle,
        title: 'Updated',
        content: 'New content',
        tags: [{ name: 'new' }],
      };
      prismaMock.article.update.mockResolvedValue(updated);
      const result = await db.update('test-article-123', dto);
      expect(result?.title).toBe('Updated');
      expect(result?.tags).toEqual(['new']);
      expect(prismaMock.article.update).toHaveBeenCalledWith({
        where: { id: 'test-article-123' },
        data: {
          title: 'Updated',
          content: 'New content',
          status: undefined,
          authorId: null,
          categoryId: null,
          tags: {
            set: [],
            connectOrCreate: [
              { where: { name: 'new' }, create: { name: 'new' } },
            ],
          },
        },
        include: { tags: true },
      });
    });

    it('handles tags as empty array', async () => {
      const dto: ArticleDto = {
        title: 'Updated',
        content: 'Content',
        tags: [],
      };
      prismaMock.article.findUnique.mockResolvedValue(mockArticle);
      prismaMock.article.update.mockResolvedValue({
        ...mockArticle,
        title: 'Updated',
        tags: [],
      });
      await db.update('test-article-123', dto);
      expect(prismaMock.article.update).toHaveBeenCalledWith({
        where: { id: 'test-article-123' },
        data: expect.objectContaining({
          tags: { set: [], connectOrCreate: [] },
        }),
        include: { tags: true },
      });
    });

    it('passes authorId and categoryId when provided', async () => {
      const dto: ArticleDto = {
        title: 'Test',
        content: 'Content',
        authorId: 'auth-1',
        categoryId: 'cat-2',
      };
      prismaMock.article.findUnique.mockResolvedValue(mockArticle);
      prismaMock.article.update.mockResolvedValue(mockArticle);
      await db.update('test-article-123', dto);
      expect(prismaMock.article.update).toHaveBeenCalledWith({
        where: { id: 'test-article-123' },
        data: expect.objectContaining({
          authorId: 'auth-1',
          categoryId: 'cat-2',
        }),
        include: { tags: true },
      });
    });

    it('returns null if article not found', async () => {
      prismaMock.article.findUnique.mockResolvedValue(null);
      expect(await db.update('missing', {} as any)).toBeNull();
      expect(prismaMock.article.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('returns true on success', async () => {
      prismaMock.article.delete.mockResolvedValue(mockArticle);
      expect(await db.delete('test-article-123')).toBe(true);
    });
    it('returns false on error', async () => {
      prismaMock.article.delete.mockRejectedValue(new Error());
      expect(await db.delete('test-article-123')).toBe(false);
    });
  });

  describe('findByAuthorId', () => {
    it('returns articles by author', async () => {
      prismaMock.article.findMany.mockResolvedValue([mockArticle]);
      expect(await db.findByAuthorId('test-user-id')).toEqual([
        expectedResponse,
      ]);
    });
    it('returns empty if none', async () => {
      prismaMock.article.findMany.mockResolvedValue([]);
      expect(await db.findByAuthorId('unknown')).toEqual([]);
    });
  });

  describe('findByCategoryId', () => {
    it('returns articles by category', async () => {
      prismaMock.article.findMany.mockResolvedValue([mockArticle]);
      expect(await db.findByCategoryId('test-category-id')).toEqual([
        expectedResponse,
      ]);
    });
    it('returns empty if none', async () => {
      prismaMock.article.findMany.mockResolvedValue([]);
      expect(await db.findByCategoryId('invalid')).toEqual([]);
    });
  });
});
