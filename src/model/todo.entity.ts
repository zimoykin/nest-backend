import { Outputable } from '../output/output.service';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Folder } from './folder.entity';
import { User } from './user.entity';
import { TodoOutputDto } from 'src/dto/todo.dto';

@Entity('todo')
export class Todo implements Outputable<TodoOutputDto> {

  static relations = ['user', 'user.todos', 'folder', 'folder.user', 'folder.todos']

  output() : any {
    return { id: this.id, 
      title: this.title,
      descr: this.descr,
      user: this.user.output()
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