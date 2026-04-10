import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto } from './user.dto';
import { UserDatabase } from '../database/user.database';
import { ArticleDatabase } from '../database/article.database';
import { CommentDatabase } from '../database/comment.database';

@Injectable()
export class UserService {
  constructor(
    private db: UserDatabase,
    private articleDb: ArticleDatabase,
    private commentDb: CommentDatabase,
  ) {}

  async getAll() {
    return this.db.getAll();
  }

  async getOne(id: string) {
    return this.db.getOne(id);
  }

  async create(userDto: CreateUserDto) {
    return this.db.create(userDto);
  }

  async updatePassword(id: string, updateDto: UpdatePasswordDto) {
    const user = await this.db.getOne(id);
    if (!user) {
      return null;
    }

    if (user.password !== updateDto.oldPassword) {
      return false;
    }

    return this.db.updatePassword(id, updateDto);
  }

  async delete(id: string) {
    await this.articleDb.setAuthorIdToNull(id);
    await this.commentDb.deleteByAuthorId(id);
    return this.db.delete(id);
  }
}
