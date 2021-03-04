import { Global, Module } from '@nestjs/common';
import { FolderService } from '../folder/folder.service';
import { TodoModule } from '../todo/todo.module';
import { UsersModule } from '../user/user.module';
import { OutputService } from './output.service';

@Global()
@Module({
    imports:[TodoModule, UsersModule, FolderService],
    providers: [OutputService]
})
export class OutputModule {}
