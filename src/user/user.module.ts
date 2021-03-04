import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../model/user.entity';
import { FolderModule } from '../folder/folder.module';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers:    [UsersService],
  controllers:  [UserController],
  exports:      [UsersService]
})
export class UsersModule {}