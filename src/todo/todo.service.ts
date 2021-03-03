import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoInputDto, TodoOutputDto, TodoUpdateDto } from '../dto/todo.dto';
import { Todo } from '../model/todo.entity';
import { UsersService } from '../user/user.service';
import { createQueryBuilder, Repository } from 'typeorm';
import { User } from '../model/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    private userService: UsersService
  ) {}

  async findAll(query?: any) : Promise<Todo[]> {
    return this.todoRepository
      .find({ where: query, relations: ['user', 'user.todos']})
  }

  async create (input: TodoInputDto, user: User) : Promise<Todo> {
    let todo = this.todoRepository.create({
        title: input.title,
        descr: input.description,
        isDone: false,
        user: user
    })

    await this.todoRepository.save(todo)

    return todo

  }

  async put ( id: string, input: TodoUpdateDto, user: User) : Promise<Todo> {
    if ( (await this.todoRepository.update( {id, user: user}, input )).affected > 0 ) {
      return this.todoRepository.findOne({ id: id, user: user}, { relations: ['user', 'user.todos']} )
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
      user: this.userService.toOutput(todo.user)};
  }
}
