import { userInfo } from 'os';
import { Outputable } from 'src/output/output.service';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Todo } from './todo.entity';
import { User } from './user.entity';

@Entity('folder')
export class Folder implements Outputable {

  output() : any {
    return { id: this.id, 
      title: this.title,
      descr: this.descr,
      todos: this.todos.length || 0,
      user: this.user.output()
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