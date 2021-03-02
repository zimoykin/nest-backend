import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { TodoInputDto } from '../dto/todo.dto';
import { TodoService } from './todo.service';

@Controller('api/todo')
export class TodoController {
    constructor( private service: TodoService ) {}

    @Get()
    async getAll() {
      return this.service.findAll().then ( users => {
        return users.map ( (val) => {
          console.log (val)
          return this.service.transform( val )
        })
      })
    }

    @Post()
    async create( @Body() input: TodoInputDto, @Res() res ) {
     try{
        return this.service.create(input).then ( todo => {
            return this.service.transform( todo )
        })
     }
     catch (err) {
         throw new HttpException( err, HttpStatus.BAD_REQUEST )
     }
    }

}
