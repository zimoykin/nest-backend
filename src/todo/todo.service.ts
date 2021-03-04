import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoInputDto, TodoOutputDto, TodoUpdateDto } from '../dto/todo.dto';
import { Todo } from '../model/todo.entity';
import { UsersService } from '../user/user.service';
import { createQueryBuilder, Repository } from 'typeorm';
import { User } from '../model/user.entity';
import { FolderService } from '../folder/folder.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>
  ) {}

  async findAll(query?: any) : Promise<Todo[]> {
    return this.todoRepository
      .find({ where: query, relations: ['user', 'user.todos', 'folder', 'folder.user', 'folder.todos']})
  }

  async create (input: TodoInputDto, user: User) : Promise<Todo> {
    const todo = this.todoRepository.create({
        title: input.title,
        descr: input.description,
        isDone: false,
        user: user
    })

    return this.todoRepository.save(todo)

  }

  async put ( id: string, input: TodoUpdateDto, user: User) : Promise<Todo> {
    if ( (await this.todoRepository.update( {id, user: user}, input )).affected > 0 ) {
      return this.todoRepository.findOne({ id: id, user: user}, { relations: ['user', 'user.todos', 'folder']} )
    } else {
      throw new HttpException( 'not updated', 400 )
    }
  }

  //TODO - public view
  transform(todo: Todo): TodoOutputDto {
    return {
      id: todo.id,
      title: todo.title, 
      description: todo.descr, 
      isDone: todo.isDone, 
      folder: todo.folder.output(),
      user: todo.user.output()};
  }
}
