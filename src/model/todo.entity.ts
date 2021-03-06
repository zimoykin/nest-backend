import { Model } from '../DefaultService/default.service';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Folder } from './folder.entity';
import { User } from './user.entity';
import { TodoInputDto, TodoOutputDto } from '../dto/todo.dto';

@Entity('todo')
@Unique(['title', 'user'])
export class Todo implements Model<TodoOutputDto, TodoInputDto> {

  hasOwner = true;
  inputDTO: TodoInputDto;

  static relations = ['user', 'user.todos', 'folder', 'folder.user', 'folder.todos']

  output() : any {
    return { id: this.id, 
      title: this.title,
      descr: this.descr,
      folder: this.folder.shortoutput(),
      user: this.user.shortoutput()
    }
  }
  shortoutput() : any {
    return { id: this.id, 
      title: this.title,
      descr: this.descr
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  descr: string;

  @Column({ type: 'boolean', default: true })
  isDone: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastChangedDateTime: Date;

  @ManyToOne(type => User, user => user.todos)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(type => Folder, folder => folder.todos)
  @JoinColumn({ name: "folderId" })
  folder: Folder;

}