import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SignupDto, LoginDto } from './auth.dto';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.interface';

vi.mock('../user/user.service');
vi.mock('@nestjs/jwt');
vi.mock('@nestjs/config');
vi.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  const mockUser: User = {
    id: 'test-uuid-123',
    login: 'testuser',
    password: 'hashedpass123',
    role: 'viewer',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService, JwtService, ConfigService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService) as jest.Mocked<UserService>;
    jwtService = module.get(JwtService) as jest.Mocked<JwtService>;
    configService = module.get(ConfigService) as jest.Mocked<ConfigService>;

    vi.clearAllMocks();

    configService.get.mockImplementation((key: string) => {
      if (key === 'JWT_SECRET') return 'test-access-secret';
      if (key === 'JWT_REFRESH_SECRET') return 'test-refresh-secret';
      return null;
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should create user with hashed password when login is available', async () => {
      const signupDto: SignupDto = {
        login: 'newuser',
        password: 'testpass123',
      };

      userService.findByLogin.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      userService.create.mockResolvedValue({
        ...mockUser,
        login: signupDto.login,
      });

      const result = await service.signup(signupDto);

      expect(result).toEqual({ message: 'User created successfully' });
      expect(userService.findByLogin).toHaveBeenCalledWith('newuser');
      expect(bcrypt.hash).toHaveBeenCalledWith('testpass123', 10);
      expect(userService.create).toHaveBeenCalledWith({
        login: 'newuser',
        password: 'hashed-password',
      });
    });

    it('should throw BadRequestException when login already exists', async () => {
      const signupDto: SignupDto = {
        login: 'existinguser',
        password: 'testpass123',
      };

      userService.findByLogin.mockResolvedValue(mockUser);

      await expect(service.signup(signupDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(userService.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return tokens when credentials are valid', async () => {
      const loginDto: LoginDto = {
        login: 'testuser',
        password: 'correctpass',
      };

      userService.findByLogin.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync
        .mockResolvedValueOnce('test-access-token')
        .mockResolvedValueOnce('test-refresh-token');

      const result = await service.login(loginDto);

      expect(result).toEqual({
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'correctpass',
        mockUser.password,
      );
    });

    it('should throw ForbiddenException when user not found', async () => {
      const loginDto: LoginDto = {
        login: 'nonexistent',
        password: 'anypass',
      };

      userService.findByLogin.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when password is incorrect', async () => {
      const loginDto: LoginDto = {
        login: 'testuser',
        password: 'wrongpass',
      };

      userService.findByLogin.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('refreshToken', () => {
    it('should return new tokens for valid refresh token', async () => {
      const validRefreshToken = 'valid-refresh-token';

      jwtService.verifyAsync.mockResolvedValue({
        userId: mockUser.id,
        login: mockUser.login,
        role: mockUser.role,
      });
      userService.findById.mockResolvedValue(mockUser);
      jwtService.signAsync
        .mockResolvedValueOnce('new-access-token')
        .mockResolvedValueOnce('new-refresh-token');

      const result = await service.refreshToken(validRefreshToken);

      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
    });

    it('should throw ForbiddenException for invalid token', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(service.refreshToken('invalid-token')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException when user not found', async () => {
      jwtService.verifyAsync.mockResolvedValue({ userId: 'non-existent-id' });
      userService.findById.mockResolvedValue(null);

      await expect(
        service.refreshToken('valid-token-but-user-gone'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
