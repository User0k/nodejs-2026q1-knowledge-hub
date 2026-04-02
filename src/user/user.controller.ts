import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserService } from './user.service';
import { CreateUserDto, UpdatePasswordDto, UserResponseDto } from './user.dto';
import { User } from './user.interface';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll() {
    const users = await this.userService.getAll();
    return users.map((user) => this.toResponseDto(user));
  }

  @Get(':id')
  async getOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.userService.getOne(id);
    if (!user) throw new NotFoundException('User not found');

    return this.toResponseDto(user);
  }

  @Post()
  async create(@Body() userDto: CreateUserDto) {
    const user = await this.userService.create(userDto);
    return this.toResponseDto(user);
  }

  @Put(':id')
  async updatePassword(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: UpdatePasswordDto,
  ) {
    const updatedUser = await this.userService.updatePassword(id, updateDto);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return this.toResponseDto(updatedUser);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.userService.delete(id);
    if (!result) {
      throw new NotFoundException('User not found');
    }
  }

  private toResponseDto(user: User): UserResponseDto {
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
