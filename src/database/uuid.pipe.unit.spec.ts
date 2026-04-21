import { describe, it, expect } from 'vitest';
import { ParseUUIDPipe } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

describe('ParseUUIDPipe', () => {
  let pipe: ParseUUIDPipe;

  beforeEach(() => {
    pipe = new ParseUUIDPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should pass valid UUID v4', async () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';
    const result = await pipe.transform(validUuid, {
      type: 'param',
      data: 'id',
    } as any);

    expect(result).toBe(validUuid);
  });

  it('should throw BadRequestException for invalid UUID format', async () => {
    const invalidUuid = 'not-a-uuid';

    await expect(
      pipe.transform(invalidUuid, { type: 'param', data: 'id' } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for malformed UUID', async () => {
    const malformedUuid = '550e8400-e29b-41d4-a716-44665544000';

    await expect(
      pipe.transform(malformedUuid, { type: 'param', data: 'id' } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for empty string', async () => {
    await expect(
      pipe.transform('', { type: 'param', data: 'id' } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException for null value', async () => {
    await expect(
      pipe.transform(null, { type: 'param', data: 'id' } as any),
    ).rejects.toThrow(BadRequestException);
  });
});
