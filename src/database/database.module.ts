import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ArticleDatabase } from './article.database';
import { CommentDatabase } from './comment.database';
import { UserDatabase } from './user.database';
import { CategoryDatabase } from './category.database';

@Global()
@Module({
  providers: [
    PrismaService,
    ArticleDatabase,
    CommentDatabase,
    UserDatabase,
    CategoryDatabase,
  ],
  exports: [
    PrismaService,
    ArticleDatabase,
    CommentDatabase,
    UserDatabase,
    CategoryDatabase,
  ],
})
export class DatabaseModule {}
