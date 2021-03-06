
import { Global, Module } from '@nestjs/common';
import { FolderService } from '../folder/folder.service';
import { TodoModule } from '../todo/todo.module';
import { UsersModule } from '../user/user.module';
import { ModelService } from './default.service';

@Global()
@Module({
    imports:[TodoModule, UsersModule, FolderService],
    providers: []
})
export class OutputModule {}