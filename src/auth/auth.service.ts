import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { SignupDto, LoginDto } from '../auth/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto) {
    const existingUser = await this.userService.findByLogin(signupDto.login);
    if (existingUser) {
      throw new BadRequestException('Login is already taken');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    await this.userService.create({
      login: signupDto.login,
      password: hashedPassword,
    });

    return { message: 'User created successfully' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByLogin(loginDto.login);
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new ForbiddenException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userService.findById(payload.userId);
      if (!user) {
        throw new ForbiddenException('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }

  private async generateTokens(user: any) {
    const payload = {
      userId: user.id,
      login: user.login,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...payload },
        {
          secret: this.configService.get<string>('JWT_SECRET')!,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { ...payload },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET')!,
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
