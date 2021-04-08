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

      //TODO: first save on redis and sent accept token on mail, save in postgres after account was accepted 
    return this.userservice
      .createOne(payload)
      .then((created) => {
        const accept = this.userservice.toAccept(created)
        return this.cacheManager
          .set(created.id, JSON.stringify(accept))
          .then(() => {
            this.mail.sendMail(created, 'accept your account', accept.acceptToken)
            return accept
          })
          .catch((err) => {
            console.log(err)
            throw new HttpException(err.message, 400)
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
      this.cacheManager.get(input.id, (err: Error, res: string) => {
        if (err) {
          reject(new NotFoundException(err.message))
          return
        }
        if (!res) {
          reject(new NotFoundException())
          return
        }

        const storeToken: AcceptToken = JSON.parse(res)
        if (storeToken.acceptToken === input.acceptToken) {
          return this.userservice
            .update(input.id, { isActive: true })
            .then(async () => {
              const user = await this.userservice.readRaw({ id: input.id })
              if (user) {
                this.cacheManager.del(input.id)
                resolve(this.userservice.toAccess(user))
              } else {
                reject(new HttpException('user not found', 400))
                return
              }
            })
            .catch((err) => {
              console.log(err)
              reject(new HttpException(err.message, 402))
              return
            })
        } else {
          reject(new HttpException('wrong access key', 400))
          return
        }
      })
    })
  }
}
