import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { ArticleDatabase } from './article.db';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService, ArticleDatabase],
  exports: [ArticleDatabase],
})
export class ArticleModule {}
