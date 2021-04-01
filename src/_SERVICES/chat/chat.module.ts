import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from '../user/user.module'
import { Chat } from '../../_MODEL/chat.entity'
import { ChatService } from './chat.service'
import { ChatController } from '../../_CONTROLLER/chat.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), UsersModule],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
