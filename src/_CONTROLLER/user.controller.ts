import {
  Body,
  CACHE_MANAGER,
  ConflictException,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  NotFoundException,
  Post,
  ValidationPipe,
} from '@nestjs/common'
import {
  AcceptToken,
  CacheUser,
  UserAccess,
  UserDto,
  UserRefreshToken,
} from '../_MODEL/_DTO/user.dto'
import { UsersService } from '../_SERVICES/user/user.service'
import { ServerError } from '../_UTILS/errors/ResponseError'
import { NetwortError } from '../_UTILS/enums/networkError'
import { Cache } from 'cache-manager'
import { Mail } from '../_SERVICES/mail/mail.service'

@Controller('api')
export class UserController {
  constructor(
    private userservice: UsersService,
    private mail: Mail,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @Post('/login')
  async login(@Body() userdto: UserDto) {
    const access = await this.userservice.login(userdto.email, userdto.password)
    if (!access) {
      throw ServerError(NetwortError.badRequest)
    }
    return this.userservice.toAccess(access)
  }

  @Post('refresh')
  async refresh(@Body() payload: UserRefreshToken) {
    return this.userservice
      .checkRefToken(payload.refreshToken)
      .then((user) => {
        return this.userservice.toAccess(user)
      })
      .catch((err) => {
        throw new HttpException(err, HttpStatus.BAD_REQUEST)
      })
  }

  @Post('register')
  async register(
    @Body(new ValidationPipe()) payload: UserDto
  ): Promise<AcceptToken> {
    //check user before
    const userExist = await this.userservice.readRaw({ email: payload.email })
    if (userExist)
      throw new ConflictException(
        'this email address has been registered early.'
      )
    const accept = this.userservice.toAccept(payload)
    const cachedUser: CacheUser = { accept: accept, payload: payload }
    return this.cacheManager
      .set(payload.email, JSON.stringify(cachedUser))
      .then(() => {
        return this.mail
          .sendMail(payload.email, 'accept your account', accept.acceptToken)
          .then(() => accept)
          .catch((err) => {
            throw new HttpException(err.message, 404)
          })
      })
      .catch((err) => {
        console.log(err)
        throw new HttpException(err.message, 400)
      })
  }

  @Post('/accept')
  async confirm(
    @Body(new ValidationPipe()) input: AcceptToken
  ): Promise<UserAccess> {
    return new Promise((resolve, reject) => {
      this.cacheManager.get(input.email, (err: Error, res: string) => {
        if (err) {
          reject(new NotFoundException(err.message))
          return
        }
        if (!res) {
          reject(new NotFoundException())
          return
        }

        const storedUser: CacheUser = JSON.parse(res)
        if (storedUser.accept.acceptToken === input.acceptToken) {
          const user = this.userservice
            .createOne(storedUser.payload)
            .then((created) => {
              this.cacheManager.del(input.email)
              resolve(this.userservice.toAccess(created))
            })
            .catch((err) => console.log(err))
        } else {
          reject(new HttpException('wrong access key', 400))
          return
        }
      })
    })
  }
}
