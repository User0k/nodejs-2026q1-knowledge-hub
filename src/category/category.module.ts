import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryDatabase } from './category.db';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryDatabase],
})
export class CategoryModule {}
