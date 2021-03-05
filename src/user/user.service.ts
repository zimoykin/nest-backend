import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  UserAccess,
  UserRefreshToken,
  UserSearchDto,
} from '../dto/user.dto';
import { createQueryBuilder } from 'typeorm';
import { User } from '../model/user.entity';
import * as bcrypt from 'bcrypt';
import { ModelService } from '../output/output.service';

const jwt = require('jsonwebtoken');


@Injectable()
export class UsersService extends ModelService(User, User.relations){

  login(email: string, password: string): Promise<User> {

    return this.readRaw({ email: email }).then((user) => {
      return bcrypt.compare(password, user.password).then((ismatch) => {
        if (ismatch) {
          return user;
        } else {
          throw new HttpException(
            Error('password incorrect'),
            HttpStatus.BAD_REQUEST,
          );
        }
      });
    });
  }

  refresh(refresh: UserRefreshToken) {
    return new Promise((resolve) => {
      this.read({refresh}).then((user) => {
        resolve(user);
      });
    });
  }

  // async createOne(userData: UserInputDto) {
  //   let user = this.usersRepository.create({
  //     isActive: true,
  //     username: userData.username,
  //     email: userData.email,
  //     password: userData.password,
  //   });
  //   await this.usersRepository.save(user);

  //   return user;
  // }

  // async remove(id: string): Promise<void> {
  //   await this.usersRepository.delete(id);
  // }

  toAccess(user: User): Promise<UserAccess> {
    const jwt_secret = process.env.JWTSECRET;
    const access: UserAccess = {
      id: user.id,
      accessToken: jwt.sign({ id: user.id }, jwt_secret, { expiresIn: '1h' }),
      refreshToken: jwt.sign({ id: user.id }, jwt_secret, { expiresIn: '72h' }),
    };

    return this.update(user.id, { refreshToken: access.refreshToken })
      .then((val) => {
        return access;
      });
  }

  async checkRefToken(ref: string): Promise<User> {
    const jwt_secret = process.env.JWTSECRET;

    return new Promise((resolve, reject) => {
      jwt.verify(ref, jwt_secret, async (err, payload) => {
        if (err) reject(err);
        let user = await this.read({ id: payload.id });
        if (!user) reject('user not found');
        resolve(user);
      });
    });
  }
}
