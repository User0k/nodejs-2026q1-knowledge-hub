import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

vi.mock('@nestjs/jwt');
vi.mock('@nestjs/config');
vi.mock('@nestjs/core');

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let reflector: jest.Mocked<Reflector>;

  const mockRequest = (authorizationHeader?: string) => ({
    headers: {
      authorization: authorizationHeader,
    },
    user: undefined as any,
  });

  const mockExecutionContext = (req: any) => {
    return new ExecutionContextHost([req, {}, {}]) as any;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard, JwtService, ConfigService, Reflector],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get(JwtService) as jest.Mocked<JwtService>;
    configService = module.get(ConfigService) as jest.Mocked<ConfigService>;
    reflector = module.get(Reflector) as jest.Mocked<Reflector>;

    vi.clearAllMocks();
    configService.get.mockReturnValue('test-jwt-secret');
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access to public routes without token', async () => {
    const req = mockRequest();
    const context = mockExecutionContext(req);

    reflector.getAllAndOverride.mockImplementation((key) => {
      if (key === IS_PUBLIC_KEY) return true;
      return false;
    });

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('should allow access with valid Bearer token', async () => {
    const req = mockRequest('Bearer valid.token.here');
    const context = mockExecutionContext(req);

    jwtService.verifyAsync.mockResolvedValue({
      userId: 'test-user-id',
      role: 'viewer',
    });

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(req.user).toBeDefined();
    expect(req.user.userId).toBe('test-user-id');
  });

  it('should throw UnauthorizedException when Authorization header is missing', async () => {
    const req = mockRequest();
    const context = mockExecutionContext(req);

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException for invalid token', async () => {
    const req = mockRequest('invalid.token.here');
    const context = mockExecutionContext(req);

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException for expired token', async () => {
    const req = mockRequest('Bearer expired.token.here');
    const context = mockExecutionContext(req);

    jwtService.verifyAsync.mockRejectedValue(new Error('Token expired'));

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
