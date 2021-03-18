import { Controller } from '@nestjs/common';
import { TodoService } from '../todo/todo.service'
import { DefaultController } from '../Controllers/default/default.controller';

@Controller('api/todo')
export class TodoController
extends DefaultController(TodoService, 'todo') { }
