import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { User } from '../model/user.entity';
import { DefaultController } from '../default/default.controller';
import { UserAccess, UserInputDto, UserRefreshToken } from '../dto/user.dto';
import { UsersService } from './user.service'

@Controller()
export class UserController  {
  constructor(private userservice: UsersService) { }

  @Post('/login')
  async login(@Body() userdto: UserInputDto) {
    let access = await this.userservice.login(userdto.email, userdto.password);
    if (!access) {
      throw new HttpException(
        Error('password is incorrect'),
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.userservice.toAccess(access);
  }

  @Post('refresh')
  async refresh(@Body() payload: UserRefreshToken) {
    return this.userservice
      .checkRefToken(payload.refreshToken)
      .then((user) => {
        return this.userservice.toAccess(user);
      })
      .catch((err) => {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      });
  }

  @Post('register')
  async register(@Body() payload: UserInputDto): Promise<UserAccess> {
    let user = await this.userservice.createOne(payload);
    return this.userservice.toAccess(user);
  }
}