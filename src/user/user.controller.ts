import { Controller, Get } from '@nestjs/common';
import { UsersService } from './user.service'

@Controller('user')
export class UserController {
  constructor (private service: UsersService) {}

  @Get()
  public async getAll() {
    return await this.service.findAll()
  }

}
