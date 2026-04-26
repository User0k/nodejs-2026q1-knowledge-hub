import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { ArticleDatabase } from '../database/article.database';
import { CommentDatabase } from '../database/comment.database';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ArticleDto } from './article.dto';
import { ArticleStatus } from './article.interface';

vi.mock('../database/article.database');
vi.mock('../database/comment.database');

describe('ArticleService', () => {
  let service: ArticleService;
  let articleDb: jest.Mocked<ArticleDatabase>;
  let commentDb: jest.Mocked<CommentDatabase>;

  const mockArticle = {
    id: 'test-article-123',
    title: 'Test Article',
    content: 'Test article content',
    authorId: 'test-user-id',
    categoryId: 'test-category-id',
    status: ArticleStatus.DRAFT,
    tags: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleService, ArticleDatabase, CommentDatabase],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    articleDb = module.get(ArticleDatabase) as jest.Mocked<ArticleDatabase>;
    commentDb = module.get(CommentDatabase) as jest.Mocked<CommentDatabase>;

    vi.clearAllMocks();
    commentDb;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all articles with filters', async () => {
      const filters = { authorId: 'test-user-id' } as any;
      articleDb.getAll.mockResolvedValue([mockArticle]);

      const result = await service.getAll(filters);

      expect(result).toEqual([mockArticle]);
      expect(articleDb.getAll).toHaveBeenCalledWith(filters);
    });

    it('should return all articles without filters', async () => {
      articleDb.getAll.mockResolvedValue([mockArticle]);

      const result = await service.getAll();

      expect(result).toEqual([mockArticle]);
      expect(articleDb.getAll).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getOne', () => {
    it('should return article by id', async () => {
      articleDb.getOne.mockResolvedValue(mockArticle);

      const result = await service.getOne('test-article-123');

      expect(result).toEqual(mockArticle);
      expect(articleDb.getOne).toHaveBeenCalledWith('test-article-123');
    });

    it('should return null when article not found', async () => {
      articleDb.getOne.mockResolvedValue(null);

      const result = await service.getOne('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create new article', async () => {
      const createDto: ArticleDto = {
        title: 'New Article',
        content: 'New article content',
        authorId: 'test-user-id',
        categoryId: 'test-category-id',
      };

      articleDb.create.mockResolvedValue({ ...mockArticle, ...createDto });

      const result = await service.create(createDto);

      expect(result).toEqual(expect.objectContaining(createDto));
      expect(articleDb.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update existing article', async () => {
      const updateDto: ArticleDto = {
        title: 'Updated Title',
        content: 'Updated content',
        authorId: 'test-user-id',
        categoryId: 'test-category-id',
      };

      articleDb.getOne.mockResolvedValue(mockArticle);
      articleDb.update.mockResolvedValue({ ...mockArticle, ...updateDto });

      const result = await service.update('test-article-123', updateDto);

      expect(result).toEqual(expect.objectContaining(updateDto));
      expect(articleDb.getOne).toHaveBeenCalledWith('test-article-123');
      expect(articleDb.update).toHaveBeenCalledWith(
        'test-article-123',
        updateDto,
      );
    });

    it('should return null when updating non-existent article', async () => {
      const updateDto: ArticleDto = {
        title: 'Updated Title',
        content: 'Updated content',
        authorId: 'test-user-id',
        categoryId: 'test-category-id',
      };

      articleDb.getOne.mockResolvedValue(null);

      const result = await service.update('non-existent-id', updateDto);

      expect(result).toBeNull();
      expect(articleDb.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete article', async () => {
      articleDb.delete.mockResolvedValue(true);

      const result = await service.delete('test-article-123');

      expect(result).toBe(true);
      expect(articleDb.delete).toHaveBeenCalledWith('test-article-123');
    });

    it('should return false when deleting non-existent article', async () => {
      articleDb.delete.mockResolvedValue(false);

      const result = await service.delete('non-existent-id');

      expect(result).toBe(false);
    });
  });
});
