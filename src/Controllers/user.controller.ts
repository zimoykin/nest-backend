import { Body, Controller, HttpException, HttpStatus, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { NewUserGuard } from '../guards/newUser.guard';
import { UserAccess, UserInputDto, UserRefreshToken } from '../dto/user.dto';
import { UsersService } from '../user/user.service'
import { ServerError } from '../errors/ResponseError';
import { NetwortError } from '../enums/networkError';

@Controller('api')
export class UserController {

  constructor(private userservice: UsersService) {}

  @Post('/login')
  async login(@Body() userdto: UserInputDto) {
    let access = await this.userservice.login(userdto.email, userdto.password);
    if (!access) {
      throw ServerError(NetwortError.badRequest);
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
  @UseGuards(NewUserGuard)
  async register(@Body( new ValidationPipe() ) payload: UserInputDto): Promise<UserAccess> {
    let user = await this.userservice.createOne(payload);
    return this.userservice.toAccess(user);
  }
}