import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import {
  AcceptToken,
  UserAccess,
  UserRefreshToken,
  UserDto,
} from '../../_MODEL/_DTO/user.dto'
import { User } from '../../_MODEL/user.entity'
import * as bcrypt from 'bcrypt'
import { ModelService } from '../DefaultService/default.service'
import { Gender } from '../../_UTILS/enums/genders'
import { Roles } from '../../_UTILS/enums/roles'

import * as jwt from 'jsonwebtoken'
const { JWTSECRET } = process.env

@Injectable()
export class UsersService extends ModelService(User, User.relations) {
  login(email: string, password: string): Promise<User> {
    return this.readRaw({ email: email, isActive: true }).then((user) => {
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
      this.read({ refresh, isActive: true }).then((user) => {
        resolve(user)
      })
    })
  }

  createOne(payload: UserDto): Promise<User> {
    const user = this.repository.create({
      username: payload.username,
      email: payload.email,
      password: payload.password,
      gender: Gender[payload.gender],
      role: Roles[payload.role],
    })

    return this.repository.save(user)
  }

  toAccess(user: User): Promise<UserAccess> {
    const access: UserAccess = {
      id: user.id,
      accessToken: jwt.sign({ id: user.id }, JWTSECRET, { expiresIn: '1h' }),
      refreshToken: jwt.sign( {}, JWTSECRET, { expiresIn: '72h' }),
    }

    return this.update(user.id, { refreshToken: access.refreshToken }).then(
      () => {
        return access
      }
    )
  }

  toAccept(payload: UserDto): AcceptToken {
    return {
      email: payload.email,
      acceptToken: jwt.sign({ email: payload.email }, JWTSECRET, { expiresIn: '5m' }),
    }
  }

  async checkRefToken(ref: string): Promise<User> {

    return new Promise((resolve, reject) => {
      jwt.verify(ref, JWTSECRET, async (err, payload: any) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          const user = await this.readRaw({refreshToken: ref, isActive: true})
          if (!user) {
            reject('user not found')
            return
          }
          resolve(user)
        }
      })
    })
  }
}
