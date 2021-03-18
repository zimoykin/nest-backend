import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './user.service';
import { UserController } from '../Controllers/user.controller';
import { User } from '../model/user.entity';
import { UserProtectedController } from '../Controllers/user-protected.controller';

@Module({
  imports:      [TypeOrmModule.forFeature([User])],
  providers:    [UsersService],
  controllers:  [UserController, UserProtectedController],
  exports:      [UsersService]
})
export class UsersModule {}