import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../user/user.service';
const jwt = require("jsonwebtoken");

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(  private service: UsersService  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const jwt_secret = process.env.JWTSECRET;
    const auth = req.headers.authorization;
    if (!auth) {
      res.sendStatus(401);
      return;
    } else {
      jwt.verify(auth.replace('Bearer ', ''), jwt_secret, async (err, payload) => {

        if (err) {
          res.statusCode = 401;
          return res.json(err);
        }

        let user = this.service.readRaw({id: payload.id}).then ( user => {
          if (user.isActive) {
            (req as any).user = user
            next();
        } else {
          res.sendStatus(401);
          return res.json({ error: 'user isnt active!' });
        }
        }).catch ( err => {
          console.log (err)
          res.sendStatus(401);
          return;
        })


      })
    }
  }
}