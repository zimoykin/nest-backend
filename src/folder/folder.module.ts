import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from '../model/folder.entity';
import { UsersModule } from '../user/user.module';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';

@Module({
    imports:        [TypeOrmModule.forFeature([Folder]), UsersModule],
    providers:      [FolderService],
    controllers:    [FolderController],
    exports:        [FolderService]
})
export class FolderModule {}
