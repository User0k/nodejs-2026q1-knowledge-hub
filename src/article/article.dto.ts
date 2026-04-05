import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { ArticleStatus } from './article.interface';

export class ArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus = ArticleStatus.DRAFT;

  @ValidateIf((obj, value) => value !== null)
  @IsUUID()
  @IsOptional()
  authorId?: string | null = null;

  @ValidateIf((obj, value) => value !== null)
  @IsOptional()
  @IsUUID()
  categoryId?: string | null = null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[] = [];
}

export class ArticleQueryDto {
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  tag?: string;
}
