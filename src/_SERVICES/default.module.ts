
import { Global, Module } from '@nestjs/common';
import { ChatService } from './chat/chat.service';
import { FolderService } from './folder/folder.service';
import { TodoModule } from './todo/todo.module';
import { UsersModule } from './user/user.module';

@Global()
@Module({
    imports:[TodoModule, UsersModule, FolderService, ChatService],
    providers: []
})
export class OutputModule {}