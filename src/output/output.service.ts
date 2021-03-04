import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/model/user.entity';
import { UsersService } from '../user/user.service';
import { Repository } from 'typeorm';
import { FolderService } from '../folder/folder.service';
import { TodoService } from '../todo/todo.service';
import { TodoModule } from 'src/todo/todo.module';

@Injectable()
export class OutputService {
      output<T extends Outputable>(model: T): any {
        return model.output()
      }
}

export interface Outputable {
    output()
}