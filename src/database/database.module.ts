import { Module, Global } from '@nestjs/common';
import { ArticleDatabase } from './article.database';
import { CommentDatabase } from './comment.database';
import { UserDatabase } from './user.database';
import { CategoryDatabase } from './category.database';

@Global()
@Module({
  providers: [ArticleDatabase, CommentDatabase, UserDatabase, CategoryDatabase],
  exports: [ArticleDatabase, CommentDatabase, UserDatabase, CategoryDatabase],
})
export class DatabaseModule {}
