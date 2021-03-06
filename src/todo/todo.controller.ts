import { Controller } from '@nestjs/common';
import { TodoService } from './todo.service';
import { DefaultController } from '../default/default.controller';

@Controller('api/todo')
export class TodoController
extends DefaultController(TodoService, 'todo') { }
