import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageController } from '../../_CONTROLLER/message.controller';
import { Message } from '../../_MODEL/message.entity';
import { UsersModule } from '../user/user.module';
import { MessageService } from './message.service';

@Module({
  imports:        [TypeOrmModule.forFeature([Message]), UsersModule],
  providers:      [MessageService],
  controllers:    [MessageController],
  exports:        []
})
export class MessageModule {}