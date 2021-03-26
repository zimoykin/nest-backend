import { Injectable } from '@nestjs/common';
import { Todo } from '../../_MODEL/todo.entity';
import { ModelService } from '../DefaultService/default.service'

@Injectable()
export class TodoService 
extends ModelService(Todo, Todo.relations) {
}
