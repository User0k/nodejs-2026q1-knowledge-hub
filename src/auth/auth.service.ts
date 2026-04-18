import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { SignupDto, LoginDto } from '../auth/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
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
    // to do
  }

  private async generateTokens(user: any) {
    // to do
  }
