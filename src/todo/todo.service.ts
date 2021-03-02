import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoInputDto, TodoOutputDto } from 'src/dto/todo.dto';
import { Todo } from '../model/todo.entity';
import { UsersService } from '../user/user.service';
import { createQueryBuilder, Repository } from 'typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    private userService: UsersService
  ) {}

  async findAll(query?: any) : Promise<Todo[]> {
    return this.todoRepository.find({ where: query, relations: ['user'] })
  }

  async create (input: TodoInputDto) : Promise<Todo> {
    let todo = this.todoRepository.create({
        title: input.title,
        descr: input.description,
        isDone: false,
        //user:
    })

    await this.todoRepository.save(todo)

    return todo

  }

  //TODO - public view
  transform(todo: Todo): TodoOutputDto {
    return {title: todo.title, description: todo.descr, isDone: todo.isDone, user: this.userService.toOutput(todo.user)};
  }
}
