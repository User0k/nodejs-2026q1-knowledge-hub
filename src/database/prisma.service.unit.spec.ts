import { vi, describe, it, expect, beforeEach } from 'vitest';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = new PrismaService();
    prismaService.$connect = vi.fn().mockResolvedValue(undefined);
    prismaService.$disconnect = vi.fn().mockResolvedValue(undefined);
  });

  it('onModuleInit should call $connect', async () => {
    await prismaService.onModuleInit();
    expect(prismaService.$connect).toHaveBeenCalled();
  });

  it('onModuleDestroy should call $disconnect', async () => {
    await prismaService.onModuleDestroy();
    expect(prismaService.$disconnect).toHaveBeenCalled();
  });
});
