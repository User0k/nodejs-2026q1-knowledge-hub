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
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDto } from './comment.dto';
import { ArticleDatabase } from '../article/article.db';

@Controller('/comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly articleDb: ArticleDatabase,
  ) {}

  @Get()
  async getAll(@Query('articleId') articleId: string) {
    return await this.commentService.getAll(articleId);
  }

  @Get(':id')
  async getOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const comment = await this.commentService.getOne(id);
    if (!comment) throw new NotFoundException('Comment not found');

    return comment;
  }

  @Post()
  async create(@Body() commentDto: CommentDto) {
    const { articleId } = commentDto;

    if (!this.articleDb.articles.has(articleId)) {
      throw new UnprocessableEntityException('Article not found');
    }

    return await this.commentService.create(commentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.commentService.delete(id);
    if (!result) {
      throw new NotFoundException('Comment not found');
    }
  }
}
