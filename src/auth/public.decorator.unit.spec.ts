import { vi, describe, it, expect } from 'vitest';
import { Public, IS_PUBLIC_KEY } from './public.decorator';
import { SetMetadata } from '@nestjs/common';

vi.mock('@nestjs/common', () => ({
  SetMetadata: vi.fn(),
}));

describe('Public Decorator', () => {
  it('should set isPublic metadata to true', () => {
    Public();
    expect(SetMetadata).toHaveBeenCalledWith(IS_PUBLIC_KEY, true);
  });
});
