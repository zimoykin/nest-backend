import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dto/user.dto';
import { Repository } from 'typeorm';
import { User } from '../model/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  createOne ( userData: UserDto) : Promise<User>{
    return new Promise( (resolve) => {
        resolve(this.usersRepository.create({ isActive: true, 
            username: userData.username, 
            email: userData.password
        }))
    })
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}