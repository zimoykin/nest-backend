import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../model/user.entity';
import { UserProtectedController } from './user-protected.controller';

@Module({
  imports:      [TypeOrmModule.forFeature([User])],
  providers:    [UsersService],
  controllers:  [UserController, UserProtectedController],
  exports:      [UsersService]
})
export class UsersModule {}