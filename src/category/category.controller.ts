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
import { CategoryService } from './category.service';
import { CategoryDto } from './category.dto';

@Controller('/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAll() {
    return await this.categoryService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const category = await this.categoryService.getOne(id);
    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  @Post()
  async create(@Body() categoryDto: CategoryDto) {
    return await this.categoryService.create(categoryDto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() categoryDto: CategoryDto,
  ) {
    const result = await this.categoryService.update(id, categoryDto);
    if (result === null) {
      throw new NotFoundException('Category not found');
    }
    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.categoryService.delete(id);
    if (!result) {
      throw new NotFoundException('Category not found');
    }
  }
}
