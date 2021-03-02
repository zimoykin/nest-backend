import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../user/user.service';
const jwt = require("jsonwebtoken");

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(  private service: UsersService  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (!auth) {
      res.sendStatus(401);
      return;
    } else {
      let payload = jwt.decode(auth.replace('Bearer ', ''));

        if (Date.now() >= payload.exp * 1000) {
          res.statusCode = 401;
          return res.json({ error: 'token is expired!' });
        } else {
            let user = await this.service.findOne(payload.id)
            if (user.isActive) {
                next();
            }
        }
      
    }
  }
}