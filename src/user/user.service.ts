import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAccess, UserInputDto, UserOutputDto, UserSearchDto } from 'src/dto/user.dto';
import { createQueryBuilder, Repository } from 'typeorm';
import { User } from '../model/user.entity';
import * as bcrypt from 'bcrypt';
import { sign as jwt } from "jsonwebtoken";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(query?: UserSearchDto): Promise<User[]> {
    return createQueryBuilder(User, 'user')
    .innerJoinAndSelect('user.todos', 'todo')
    .where(query)
    .orderBy('username')
    .getMany();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }


  login(email: string, password: string): Promise<User> {
      return this.usersRepository.findOne({ email: email }).then ( user => {
       return bcrypt.compare(password, user.password).then( ismatch => {
          if (ismatch) { return user }
          else { throw new HttpException( Error('password incorrect'), HttpStatus.BAD_REQUEST ) }
        })
      })

  }

  async createOne(userData: UserInputDto) {
    let user = this.usersRepository.create({
      isActive: true,
      username: userData.username,
      email: userData.email,
      password: userData.password,
    });
    await this.usersRepository.save(user);

    return user;
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  toOutput(user: User) : UserOutputDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      todos: user.todos != undefined ? user.todos.length : 0,
    };
  }

  toAccess(user: User) : UserAccess {
    const jwt_secret = process.env.JWTSECRET;
    return {
      id: user.id,
      accessToken: jwt({ id: user.id }, jwt_secret, { expiresIn: "1h" }),
      refreshToken: jwt({ id: user.id }, jwt_secret, { expiresIn: "24h" })
    };
  }

}
