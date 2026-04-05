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
    const user = this.db.getOne(id);
    if (!user) {
      return null;
    }

    if (user.password !== updateDto.oldPassword) {
      return false;
    }

    return this.db.updatePassword(id, updateDto);
  }

  async delete(id: string) {
    // Set authorId to null in all articles authored by this user
    this.articleDb.setAuthorIdToNull(id);

    // Delete all comments authored by this user
    this.commentDb.deleteByAuthorId(id);

    // Delete the user
    return this.db.delete(id);
  }
}
