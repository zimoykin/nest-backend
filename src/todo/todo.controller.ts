import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { Todo } from '../model/todo.entity';
import { TodoInputDto, TodoOutputDto, TodoUpdateDto } from '../dto/todo.dto';
import { TodoService } from './todo.service';

@Controller('api/todo')
export class TodoController {
    constructor( private service: TodoService ) {}

    @Get()
    async getAll( @Req() req ) {
      return this.service.readAll({ user: req.user })
    }

    @Post()
    async create( @Body() input: TodoInputDto, @Req() req ) {
      return this.service.read(input)
    }

    @Put(':id')
    async put ( @Param('id') id: string, @Body() input: TodoUpdateDto, @Req() req) {

    }

}
