import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from '../todo/todo.module';
import { Folder } from '../model/folder.entity';
import { UsersModule } from '../user/user.module';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';
import { TodoService } from '../todo/todo.service';
import { DefaultController } from '../default/default.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Folder]), UsersModule],
    providers:      [FolderService],
    controllers:    [FolderController],
    exports:        [FolderService]
})
export class FolderModule {}
