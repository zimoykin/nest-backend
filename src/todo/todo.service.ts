import { Injectable } from '@nestjs/common';
import { Todo } from '../model/todo.entity';
import { ModelService } from '../output/output.service'

@Injectable()
export class TodoService 
  extends ModelService(Todo, Todo.relations) {
}
