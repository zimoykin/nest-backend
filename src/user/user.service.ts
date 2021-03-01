import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInputDto, UserOutputDto, UserSearchDto } from 'src/dto/user.dto';
import { createQueryBuilder, Repository } from 'typeorm';
import { Query } from 'typeorm/driver/Query';
import { User } from '../model/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

  ) {}

  async findAll(query?: UserSearchDto): Promise<User[]> {

    return createQueryBuilder(User)
    .where( query )
    .orderBy('username')
    .getMany()

  }

  findOne(id: string): Promise<User> {
       return this.usersRepository.findOne(id); 
  }

  async createOne ( userData: UserInputDto ) {
 
        let user = this.usersRepository.create({ 
            isActive: true, 
            username: userData.username, 
            email: userData.email,
            password: userData.password
        })
        await this.usersRepository
        .save(user)

        return user
  }
  

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  transformUser (user: User) : UserOutputDto {
    return { id: user.id, username: user.username, email: user.email, todos: (user.todos != undefined) ? user.todos.length : 0 }
  }

}
