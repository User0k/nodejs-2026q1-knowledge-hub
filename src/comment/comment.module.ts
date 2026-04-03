import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentDatabase } from './comment.db';
import { ArticleModule } from '../article/article.module';

@Module({
  imports: [ArticleModule],
  controllers: [CommentController],
  providers: [CommentService, CommentDatabase],
})
export class CommentModule {}
