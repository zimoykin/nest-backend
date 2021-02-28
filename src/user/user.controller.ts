import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { UsersService } from './user.service'

@Controller('user')
export class UserController {
  constructor (private service: UsersService) {}

  @Get()
  public async getAll() {
    return await this.service.findAll()
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() userdata: UserDto) {
    return this.service.createOne(userdata);
  }

}
