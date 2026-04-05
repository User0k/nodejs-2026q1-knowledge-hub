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
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleDto, ArticleQueryDto } from './article.dto';

@Controller('/article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async getAll(@Query() query: ArticleQueryDto) {
    return await this.articleService.getAll(query);
  }

  @Get(':id')
  async getOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const article = await this.articleService.getOne(id);
    if (!article) throw new NotFoundException('Article not found');

    return article;
  }

  @Post()
  async create(@Body() articleDto: ArticleDto) {
    return await this.articleService.create(articleDto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: ArticleDto,
  ) {
    const result = await this.articleService.update(id, updateDto);
    if (result === null) {
      throw new NotFoundException('Article not found');
    }
    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.articleService.delete(id);
    if (!result) {
      throw new NotFoundException('Article not found');
    }
  }
}
