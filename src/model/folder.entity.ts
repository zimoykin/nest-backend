import { userInfo } from 'os';
import { Model } from '../DefaultService/default.service';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Todo } from './todo.entity';
import { User } from './user.entity';
import { FolderDto, FolderOutputDto } from 'src/dto/folder.dto';

@Entity('folder')
export class Folder implements Model<FolderOutputDto, FolderDto>{
  hasOwner = true
  inputDTO: FolderDto;
  outputDTO: FolderOutputDto;

  static relations = ['todos', 'user', 'user.todos', 'todos.user']

  output(): any {
    return { id: this.id, 
      title: this.title,
      descr: this.descr,
      todos: this.todos.map ( todo => { return todo.shortoutput() }),
      user: this.user.shortoutput()
    }
  }

  shortoutput (): any {
    return { id: this.id, 
      title: this.title,
      descr: this.descr,
      todos: this.todos.length || 0,
      user: this.user.shortoutput()
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({unique: true})
  title: string;

  @Column()
  descr: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastChangedDateTime: Date;

  @OneToMany(type => Todo, todo => todo.folder)
  todos: Todo[];

  @ManyToOne(type => User, user => user.folders)
  @JoinColumn({ name: "userId" })
  user: User;

}