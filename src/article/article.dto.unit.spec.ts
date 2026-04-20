import { validate } from 'class-validator';
import { ArticleDto, ArticleQueryDto } from './article.dto';
import { ArticleStatus } from './article.interface';
import { describe, it, expect } from 'vitest';

function buildArticleDto(overrides?: Partial<ArticleDto>): ArticleDto {
  const dto = new ArticleDto();
  dto.title = 'Valid Article Title';
  dto.content = 'Valid article content';
  if (overrides) {
    Object.assign(dto, overrides);
  }
  return dto;
}

function buildArticleQueryDto(
  overrides?: Partial<ArticleQueryDto>,
): ArticleQueryDto {
  const dto = new ArticleQueryDto();
  if (overrides) {
    Object.assign(dto, overrides);
  }
  return dto;
}

describe('ArticleDto Validation', () => {
  it('should validate successfully with valid data', async () => {
    const dto = buildArticleDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when title is missing', async () => {
    const dto = buildArticleDto({ title: undefined });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
  });

  it('should fail when title is empty string', async () => {
    const dto = buildArticleDto({ title: '' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
  });

  it('should fail when content is missing', async () => {
    const dto = buildArticleDto({ content: undefined });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('content');
  });

  it('should fail when title is not a string', async () => {
    const dto = buildArticleDto({ title: 12345 as any });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
  });

  it('should accept valid status enum value', async () => {
    const dto = buildArticleDto({ status: ArticleStatus.PUBLISHED });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when status is invalid enum value', async () => {
    const dto = buildArticleDto({ status: 'invalid-status' as any });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('status');
  });

  it('should accept valid UUID for authorId', async () => {
    const dto = buildArticleDto({
      authorId: '550e8400-e29b-41d4-a716-446655440000',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when authorId is invalid UUID', async () => {
    const dto = buildArticleDto({ authorId: 'invalid-uuid' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('authorId');
  });

  it('should accept null for authorId', async () => {
    const dto = buildArticleDto({ authorId: null });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should accept string array for tags', async () => {
    const dto = buildArticleDto({ tags: ['nestjs', 'testing', 'typescript'] });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when tags is not an array', async () => {
    const dto = buildArticleDto({ tags: 'not-an-array' as any });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('tags');
  });
});

describe('ArticleQueryDto Validation', () => {
  it('should validate successfully with empty query', async () => {
    const dto = buildArticleQueryDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should accept valid status for filtering', async () => {
    const dto = buildArticleQueryDto({ status: ArticleStatus.PUBLISHED });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when status is invalid', async () => {
    const dto = buildArticleQueryDto({ status: 'invalid-status' as any });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('status');
  });

  it('should accept valid UUID for categoryId', async () => {
    const dto = buildArticleQueryDto({
      categoryId: '550e8400-e29b-41d4-a716-446655440000',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when categoryId is invalid UUID', async () => {
    const dto = buildArticleQueryDto({ categoryId: 'invalid-uuid' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('categoryId');
  });

  it('should accept string tag filter', async () => {
    const dto = buildArticleQueryDto({ tag: 'nestjs' });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
