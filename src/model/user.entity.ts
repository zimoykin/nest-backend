import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Todo } from '../model/todo.entity';
import { Folder } from './folder.entity';
import { Outputable } from 'src/output/output.service';
import { title } from 'process';

@Entity('user')
export class User implements Outputable {
  output(): any {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      folders: this.folders.map((val) => {
        return {
          id: val.id,
          title: val.title,
          todos: val.todos.map((todo) => {
            return { id: todo.id, title: todo.title };
          }),
        };
      }),
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

  @OneToMany((type) => Todo, (todo) => todo.user, { cascade: true })
  todos: Todo[];

  @OneToMany((type) => Folder, (folder) => folder.user, { cascade: true })
  folders: Folder[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}