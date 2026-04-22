import { vi, describe, it, expect, beforeEach } from 'vitest';
import { UserDatabase } from './user.database';
import { PrismaService } from './prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserRole } from '../user/user.interface';

describe('UserDatabase', () => {
  let userDatabase: UserDatabase;
  let prismaService: PrismaService;

  const mockPrismaUser = {
    id: 'test-id',
    login: 'testuser',
    password: 'testpass',
    role: UserRole.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const expectedUser = {
    id: 'test-id',
    login: 'testuser',
    password: 'testpass',
    role: 'admin',
    createdAt: Number(mockPrismaUser.createdAt),
    updatedAt: Number(mockPrismaUser.updatedAt),
  };

  beforeEach(() => {
    prismaService = {
      user: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      comment: {
        deleteMany: vi.fn(),
      },
      article: {
        updateMany: vi.fn(),
      },
      $transaction: vi.fn(),
    } as unknown as PrismaService;

    userDatabase = new UserDatabase(prismaService);
  });

  it('should return all users', async () => {
    vi.mocked(prismaService.user.findMany).mockResolvedValue([mockPrismaUser]);
    const result = await userDatabase.getAll();
    expect(prismaService.user.findMany).toHaveBeenCalled();
    expect(result).toEqual([expectedUser]);
  });

  it('should return a user when found', async () => {
    vi.mocked(prismaService.user.findUnique).mockResolvedValue(mockPrismaUser);
    const result = await userDatabase.getOne('test-id');
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'test-id' },
    });
    expect(result).toEqual(expectedUser);
  });

  it('should return null when user not found', async () => {
    vi.mocked(prismaService.user.findUnique).mockResolvedValue(null);
    const result = await userDatabase.getOne('invalid-id');
    expect(result).toBeNull();
  });

  it('should find user by login and return it', async () => {
    vi.mocked(prismaService.user.findUnique).mockResolvedValue(mockPrismaUser);
    const result = await userDatabase.getByLogin('testuser');
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { login: 'testuser' },
    });
    expect(result).toEqual(expectedUser);
  });

  it('should return null when user with this login not found', async () => {
    vi.mocked(prismaService.user.findUnique).mockResolvedValue(null);
    const result = await userDatabase.getByLogin('invaliduser');
    expect(result).toBeNull();
  });

  it('should create user', async () => {
    const createData = {
      login: 'newuser',
      password: 'newpass',
      role: UserRole.ADMIN,
    };
    vi.mocked(prismaService.user.create).mockResolvedValue(mockPrismaUser);
    const result = await userDatabase.create(createData);
    expect(prismaService.user.create).toHaveBeenCalledWith({
      data: createData,
    });
    expect(result).toEqual(expectedUser);
  });

  it('should update password and return user', async () => {
    const updateData = { oldPassword: 'old', newPassword: 'new' };
    vi.mocked(prismaService.user.update).mockResolvedValue(mockPrismaUser);
    const result = await userDatabase.updatePassword('test-id', updateData);
    expect(prismaService.user.update).toHaveBeenCalledWith({
      where: { id: 'test-id' },
      data: { password: 'new' },
    });
    expect(result).toEqual(expectedUser);
  });

  it('should throw when user not found', async () => {
    const updateData = { oldPassword: 'old', newPassword: 'new' };
    const prismaError = new PrismaClientKnownRequestError('User not found', {
      code: 'P2025',
      clientVersion: '5.0.0',
    });
    vi.mocked(prismaService.user.update).mockRejectedValue(prismaError);
    await expect(
      userDatabase.updatePassword('invalid-id', updateData),
    ).rejects.toThrow();
  });

  it('should return true on successful user deletion', async () => {
    vi.mocked(prismaService.$transaction).mockResolvedValue([]);
    vi.mocked(prismaService.article.updateMany).mockResolvedValue({
      count: 0,
    } as any);
    vi.mocked(prismaService.comment.deleteMany).mockResolvedValue({
      count: 0,
    } as any);
    vi.mocked(prismaService.user.delete).mockResolvedValue({} as any);

    const result = await userDatabase.delete('test-id');

    expect(prismaService.$transaction).toHaveBeenCalled();
    expect(prismaService.article.updateMany).toHaveBeenCalledWith({
      where: { authorId: 'test-id' },
      data: { authorId: null },
    });
    expect(prismaService.comment.deleteMany).toHaveBeenCalledWith({
      where: { authorId: 'test-id' },
    });
    expect(prismaService.user.delete).toHaveBeenCalledWith({
      where: { id: 'test-id' },
    });
    expect(result).toBe(true);
  });

  it('should return false on transaction error with user deletion', async () => {
    vi.mocked(prismaService.$transaction).mockRejectedValue(
      new Error('Test error'),
    );
    const result = await userDatabase.delete('test-id');
    expect(result).toBe(false);
  });
});
