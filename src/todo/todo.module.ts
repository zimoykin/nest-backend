import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../user/user.service';
import { Todo } from '../model/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { Repository } from 'typeorm';
import { UsersModule } from '../user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([Todo]), UsersModule],
    providers: [TodoService],
    controllers: [TodoController]
})
export class TodoModule {}
