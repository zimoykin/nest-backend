import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Todo } from './todo.entity';
import { Folder } from './folder.entity';
import { UserInputDto } from './_DTO/user.dto';
import { ApiModel } from './apimodel';
import { Chat } from './chat.entity';

@Entity('user')
export class User implements ApiModel {

  hasOwner = false;
  inputDTO: UserInputDto;

  static relations: string[] = ['todos', 'folders', 'folders.todos', 'chats'];

  output(): any {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      folder: this.folders.map((val) => {
        return {
          id: val.id,
          title: val.title,
          description: val.descr,
          todos: val.todos.length || 0,
        };
      }),
    };
  }

  shortoutput(): any {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
    };
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastChangedDateTime: Date;

  @OneToMany(() => Todo, (todo) => todo.user, { cascade: true })
  todos: Todo[];

  @OneToMany(() => Folder, (folder) => folder.user, { cascade: true })
  folders: Folder[];

  @ManyToMany(() => Chat, (chat) => chat.users, { eager: true })
  chats: Chat[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

}