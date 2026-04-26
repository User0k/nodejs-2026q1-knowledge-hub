import { Test, TestingModule } from '@nestjs/testing';
import { CommentDatabase } from './comment.database';
import { PrismaService } from './prisma.service';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CommentDto } from '../comment/comment.dto';

describe('CommentDatabase', () => {
  let db: CommentDatabase;
  let prismaMock: any;

  const mockDate = new Date('2026-01-01T00:00:00Z');
  const mockComment = {
    id: 'comment-123',
    content: 'Great article!',
    articleId: 'article-456',
    authorId: 'user-789',
    createdAt: mockDate,
  };

  const expectedComment = {
    ...mockComment,
    createdAt: mockDate.getTime(),
  };

  beforeEach(async () => {
    prismaMock = {
      comment: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentDatabase,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    db = module.get<CommentDatabase>(CommentDatabase);
  });

  it('should be defined', () => {
    expect(db).toBeDefined();
  });

  describe('getAll', () => {
    it('returns all comments for an article', async () => {
      prismaMock.comment.findMany.mockResolvedValue([mockComment]);
      const result = await db.getAll('article-456');
      expect(result).toEqual([expectedComment]);
      expect(prismaMock.comment.findMany).toHaveBeenCalledWith({
        where: { articleId: 'article-456' },
      });
    });

    it('returns empty array if no comments', async () => {
      prismaMock.comment.findMany.mockResolvedValue([]);
      const result = await db.getAll('article-456');
      expect(result).toEqual([]);
    });
  });

  describe('getOne', () => {
    it('returns comment by id', async () => {
      prismaMock.comment.findUnique.mockResolvedValue(mockComment);
      const result = await db.getOne('comment-123');
      expect(result).toEqual(expectedComment);
      expect(prismaMock.comment.findUnique).toHaveBeenCalledWith({
        where: { id: 'comment-123' },
      });
    });

    it('returns null if comment not found', async () => {
      prismaMock.comment.findUnique.mockResolvedValue(null);
      const result = await db.getOne('invalid');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('creates a new comment', async () => {
      const dto: CommentDto = {
        content: 'Nice post!',
        articleId: 'article-456',
        authorId: 'user-789',
      };
      const created = {
        ...mockComment,
        content: 'Nice post!',
      };
      prismaMock.comment.create.mockResolvedValue(created);
      const result = await db.create(dto);
      expect(result).toEqual({
        ...expectedComment,
        content: 'Nice post!',
      });
      expect(prismaMock.comment.create).toHaveBeenCalledWith({
        data: {
          content: 'Nice post!',
          articleId: 'article-456',
          authorId: 'user-789',
        },
      });
    });
  });

  describe('delete', () => {
    it('returns true on successful deletion', async () => {
      prismaMock.comment.delete.mockResolvedValue(mockComment);
      const result = await db.delete('comment-123');
      expect(result).toBe(true);
      expect(prismaMock.comment.delete).toHaveBeenCalledWith({
        where: { id: 'comment-123' },
      });
    });

    it('returns false if deletion fails (comment not found)', async () => {
      prismaMock.comment.delete.mockRejectedValue(new Error('Not found'));
      const result = await db.delete('invalid');
      expect(result).toBe(false);
    });
  });
});
