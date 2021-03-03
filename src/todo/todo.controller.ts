import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { TodoInputDto, TodoUpdateDto } from '../dto/todo.dto';
import { TodoService } from './todo.service';

@Controller('api/todo')
export class TodoController {
    constructor( private service: TodoService ) {}

    @Get()
    async getAll( @Req() req ) {
      return this.service.findAll( {user: req.user} ).then ( todos => {
        return todos.map ( (val) => {
          console.log (val)
          return this.service.transform( val )
        })
      })
    }

    @Post()
    async create( @Body() input: TodoInputDto, @Req() req ) {
     try{
        return this.service.create( input, req.user ).then ( todo => {
            return this.service.transform( todo )
        })
     }
     catch (err) {
         throw new HttpException( err, HttpStatus.BAD_REQUEST )
     }
    }

    @Put(':id')
    async put ( @Param('id') id: string, @Body() input: TodoUpdateDto, @Req() req) {
      let todo = await this.service.put(id, input, req.user)
      return this.service.transform(todo)
    }

}
