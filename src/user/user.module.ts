import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDatabase } from './user.db';

@Module({
  controllers: [UserController],
  providers: [UserService, UserDatabase],
})
export class UserModule {}
