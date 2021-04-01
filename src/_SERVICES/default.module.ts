import { Global, Module } from '@nestjs/common'
import { ChatService } from './chat/chat.service'
import { FolderService } from './folder/folder.service'
import { MessageService } from './message/message.service'
import { TodoModule } from './todo/todo.module'
import { UsersModule } from './user/user.module'

@Global()
@Module({
  imports: [
    TodoModule,
    UsersModule,
    FolderService,
    ChatService,
    MessageService,
  ],
  providers: [],
})
export class OutputModule {}
