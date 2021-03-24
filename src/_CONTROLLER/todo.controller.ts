import { Controller } from '@nestjs/common';
import { TodoService } from '../_SERVICES/todo/todo.service'
import { RestController } from './rest.controller';

@Controller('api/todo')
export class TodoController
extends RestController(TodoService) { }
