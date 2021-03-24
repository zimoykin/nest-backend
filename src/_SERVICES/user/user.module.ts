import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './user.service';
import { UserController } from '../../_CONTROLLER/user.controller';
import { User } from '../../_MODEL/user.entity';
import { UserProtectedController } from '../../_CONTROLLER/user-protected.controller';

@Module({
  imports:      [TypeOrmModule.forFeature([User])],
  providers:    [UsersService],
  controllers:  [UserController, UserProtectedController],
  exports:      [UsersService]
})
export class UsersModule {}