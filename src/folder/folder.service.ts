import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Folder } from '../model/folder.entity';
import { User } from '../model/user.entity';
import { UsersService } from '../user/user.service';
import { Repository } from 'typeorm';
import { FolderDto, FolderFullDto, FolderOutputDto } from '../dto/folder.dto';
import { TodoService } from '../todo/todo.service';


@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>
  ) {}

  findAll(user: User, query?: any) : Promise<Folder[]> {
    return new Promise((resolve) => {
      this.folderRepository
        .find({
          where: query,
          relations: ['todos', 'user', 'user.todos', 'todos.user'],
        })
        .then((values) => {
            resolve(
              values.filter((val) => {
                return (val.user = user);
              })
            );
        });
    });
  }

  async create(user: User, input: FolderDto) {
    let folder = this.folderRepository.create({
      title: input.title,
      descr: input.description,
      user: user,
    });
    this.folderRepository.save(folder);

    return folder;
  }

  toOutput(val: Folder): FolderOutputDto {
    return {
      title: val.title,
      description: val.descr,
      id: val.id,
      todos: val.todos.length
    };
  }

  toFullOutput(val: Folder): FolderFullDto {
    return {
      title: val.title,
      description: val.descr,
      id: val.id,
      todos: val.todos.map((val) => {
        return { id: val.id, title: val.title };
      }),
      user: val.user.output(),
    };
  }
}
