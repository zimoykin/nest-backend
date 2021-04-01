import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { UsersService } from '../../_SERVICES/user/user.service'
import { ServerError } from '../errors/ResponseError'
import { NetwortError } from '../enums/networkError'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private service: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const jwt_secret = process.env.JWTSECRET
    const auth = req.headers.authorization
    if (!auth) {
      throw ServerError(NetwortError.unauthorized, 'missing auth. method')
    } else {
      return jwt.verify(
        auth.replace('Bearer ', ''),
        jwt_secret,
        async (err: Error, payload: any) => {
          if (err) {
            throw ServerError(NetwortError.unauthorized, err.message)
          }

          return this.service
            .readRaw({ id: payload.id })
            .then((user) => {
              if (user && user.isActive) {
                ;(req as any).user = user
                next()
              } else {
                throw ServerError(
                  NetwortError.unauthorized,
                  'user not found or unactive'
                )
              }
            })
            .catch((err) => {
              throw ServerError(NetwortError.unauthorized, err)
            })
        }
      )
    }
  }
}
