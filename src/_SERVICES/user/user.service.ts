import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import {
  AcceptToken,
  UserAccess,
  UserInputDto,
  UserRefreshToken,
} from '../../_MODEL/_DTO/user.dto'
import { User } from '../../_MODEL/user.entity'
import * as bcrypt from 'bcrypt'
import { ModelService } from '../DefaultService/default.service'
import { Gender } from '../../_UTILS/enums/genders'
import { Roles } from '../../_UTILS/enums/roles'

import * as jwt from 'jsonwebtoken'

@Injectable()
export class UsersService extends ModelService(User, User.relations) {
  login(email: string, password: string): Promise<User> {
    return this.readRaw({ email: email }).then((user) => {
      if (user) {
        return bcrypt.compare(password, user.password).then((ismatch) => {
          if (ismatch) {
            return user
          } else {
            throw new HttpException(
              Error('password incorrect'),
              HttpStatus.BAD_REQUEST
            )
          }
        })
      } else throw new NotFoundException()
    })
  }

  refresh(refresh: UserRefreshToken) {
    return new Promise((resolve) => {
      this.read({ refresh }).then((user) => {
        resolve(user)
      })
    })
  }

  createOne(payload: UserInputDto): Promise<User> {
    const user = this.repository.create({
      isActive: true,
      username: payload.username,
      email: payload.email,
      password: payload.password,
      gender: Gender[payload.gender],
      role: Roles[payload.role],
    })

    return this.repository.save(user)
  }

  toAccess(user: User): Promise<UserAccess> {
    const jwt_secret = process.env.JWTSECRET
    const access: UserAccess = {
      id: user.id,
      accessToken: jwt.sign({ id: user.id }, jwt_secret, { expiresIn: '1h' }),
      refreshToken: jwt.sign({ id: user.id }, jwt_secret, { expiresIn: '72h' }),
    }

    return this.update(user.id, { refreshToken: access.refreshToken }).then(
      () => {
        return access
      }
    )
  }

  toAccept(user: User): AcceptToken {
    const jwt_secret = process.env.JWTSECRET
    return {
      id: user.id,
      acceptToken: jwt.sign({ id: user.id }, jwt_secret, { expiresIn: '5m' }),
    }
  }

  async checkRefToken(ref: string): Promise<User> {
    const jwt_secret = process.env.JWTSECRET

    return new Promise((resolve, reject) => {
      jwt.verify(ref, jwt_secret, async (err, payload: any) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          const user = await this.readRaw({ id: payload.id })
          if (!user) reject('user not found')
          resolve(user)
        }
      })
    })
  }
}
