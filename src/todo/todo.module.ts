import { Module, Global} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from '../model/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { UsersModule } from '../user/user.module';
import { FolderModule } from '../folder/folder.module';

@Module({
    imports: [TypeOrmModule.forFeature([Todo]), UsersModule],
    providers:      [TodoService],
    controllers:    [TodoController],
    exports:        []
})
export class TodoModule {}