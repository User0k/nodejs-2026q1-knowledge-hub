import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserDatabase } from '../database/user.database';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateUserDto } from './user.dto';
import { User } from './user.interface';

vi.mock('../database/user.database');

describe('UserService', () => {
  let service: UserService;
  let userDb: jest.Mocked<UserDatabase>;

  const mockUser: User = {
    id: 'test-uuid',
    login: 'testuser',
    password: 'hashedpass',
    role: 'viewer',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserDatabase],
    }).compile();

    service = module.get<UserService>(UserService);
    userDb = module.get(UserDatabase) as jest.Mocked<UserDatabase>;
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      userDb.getAll.mockResolvedValue([mockUser]);
      const result = await service.getAll();
      expect(result).toEqual([mockUser]);
      expect(userDb.getAll).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should return user by id', async () => {
      userDb.getOne.mockResolvedValue(mockUser);
      const result = await service.getOne('test-uuid');
      expect(result).toEqual(mockUser);
      expect(userDb.getOne).toHaveBeenCalledWith('test-uuid');
    });

    it('should return null for non-existent id', async () => {
      userDb.getOne.mockResolvedValue(null);
      const result = await service.getOne('invalid-uuid');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user by id (alias for getOne)', async () => {
      userDb.getOne.mockResolvedValue(mockUser);
      const result = await service.findById('test-uuid');
      expect(result).toEqual(mockUser);
      expect(userDb.getOne).toHaveBeenCalledWith('test-uuid');
    });
  });

  describe('findByLogin', () => {
    it('should return user when login exists', async () => {
      userDb.getByLogin.mockResolvedValue(mockUser);
      const result = await service.findByLogin('testuser');
      expect(result).toEqual(mockUser);
      expect(userDb.getByLogin).toHaveBeenCalledWith('testuser');
    });

    it('should return null when login not found', async () => {
      userDb.getByLogin.mockResolvedValue(null);
      const result = await service.findByLogin('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create user with valid data', async () => {
      const userDto: CreateUserDto = {
        login: 'newuser',
        password: 'TestPass123!',
      };
      const createdUser = {
        ...mockUser,
        login: 'newuser',
        password: 'hashedpass',
      };
      userDb.create.mockResolvedValue(createdUser);

      const result = await service.create(userDto);
      expect(result).toEqual(createdUser);
      expect(userDb.create).toHaveBeenCalledWith(userDto);
    });
  });

  describe('updatePassword', () => {
    it('should update password when old password matches', async () => {
      const userWithPlainPassword = { ...mockUser, password: 'oldpass' };
      userDb.getOne.mockResolvedValue(userWithPlainPassword);
      const updatedUser = {
        ...userWithPlainPassword,
        password: 'newhashed',
        updatedAt: Date.now(),
      };
      userDb.updatePassword.mockResolvedValue(updatedUser);

      const result = await service.updatePassword('test-uuid', {
        oldPassword: 'oldpass',
        newPassword: 'newpass',
      });

      expect(result).toEqual(updatedUser);
      expect(userDb.updatePassword).toHaveBeenCalledWith('test-uuid', {
        oldPassword: 'oldpass',
        newPassword: 'newpass',
      });
    });

    it('should return false when old password does not match', async () => {
      const userWithPlainPassword = { ...mockUser, password: 'oldpass' };
      userDb.getOne.mockResolvedValue(userWithPlainPassword);

      const result = await service.updatePassword('test-uuid', {
        oldPassword: 'wrongpass',
        newPassword: 'newpass',
      });

      expect(result).toBe(false);
      expect(userDb.updatePassword).not.toHaveBeenCalled();
    });

    it('should return null when user not found', async () => {
      userDb.getOne.mockResolvedValue(null);

      const result = await service.updatePassword('invalid-uuid', {
        oldPassword: 'anything',
        newPassword: 'newpass',
      });

      expect(result).toBeNull();
      expect(userDb.updatePassword).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete user and return true on success', async () => {
      userDb.delete.mockResolvedValue(true);
      const result = await service.delete('test-uuid');
      expect(result).toBe(true);
      expect(userDb.delete).toHaveBeenCalledWith('test-uuid');
    });

    it('should return false when deletion fails', async () => {
      userDb.delete.mockResolvedValue(false);
      const result = await service.delete('invalid-uuid');
      expect(result).toBe(false);
    });
  });
});
