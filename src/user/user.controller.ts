import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { UserInputDto, UserOutputDto, UserRefreshToken, UserSearchDto } from '../dto/user.dto';
import { User } from '../model/user.entity';
import { UsersService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private service: UsersService) 
  {}

  @Get('api/search')
  async search ( @Query() params: UserSearchDto ) {
    return await this.service.findAll(params).then ( users => {
      return users.map ( (val) => {
        console.log (val)
        return this.service.toOutput( val )
      })
    })
  }

  @Get('')
  async getAll() {
    return this.service.findAll().then ( users => {
      return users.map ( (val) => {
        console.log (val)
        return this.service.toOutput( val )
      })
    })
  }

  @Get(':id')
  async findOne( @Param('id') id: string) {
      return this.service.findOne(id).then ( (user) => {
        return this.service.toOutput(user)
      })
  }

  @Post()
  async create(@Body() userdto: UserInputDto) {
    try{
      let user = await this.service.createOne(userdto);
      return this.service.toAccess(user)
     }
     catch (err) {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
     }
  }

  @Post('login')
  async login (@Body() userdto: UserInputDto) {
    let access = await this.service.login( userdto.email, userdto.password )
    if (!access) {
      throw new HttpException(Error('password is incorrect'), HttpStatus.BAD_REQUEST);
    }
    return this.service.toAccess(access)
  }

  @Post('refresh')
  async refresh ( @Body() payload: UserRefreshToken ) {
    return this.service.checkRefToken( payload.refreshToken )
    .then ( user => {
      return this.service.toAccess(user)
    }).catch (err => {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    })
  };

}