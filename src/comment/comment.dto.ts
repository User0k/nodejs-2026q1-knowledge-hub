import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  articleId: string;

  @ValidateIf((obj, value) => value !== null)
  @IsUUID()
  @IsOptional()
  authorId?: string | null = null;
}
