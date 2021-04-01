import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'
import { Folder } from './folder.entity'
import { ApiModel } from './apimodel'
import { User } from './user.entity'

@Entity('todo')
@Unique(['title', 'user'])
export class Todo implements ApiModel {
  hasOwner = true

  static relations = [
    'user',
    'user.todos',
    'folder',
    'folder.user',
    'folder.todos',
  ]

  output(): any {
    return {
      id: this.id,
      title: this.title,
      descr: this.descr,
      folder: this.folder.shortoutput(),
      user: this.user.shortoutput(),
    }
  }
  shortoutput(): any {
    return { id: this.id, title: this.title, descr: this.descr }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column()
  descr: string

  @Column({ type: 'boolean', default: true })
  isDone: boolean

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastChangedDateTime: Date

  @ManyToOne(() => User, (user) => user.todos)
  @JoinColumn({ name: 'userId' })
  user: User

  @ManyToOne(() => Folder, (folder) => folder.todos)
  @JoinColumn({ name: 'folderId' })
  folder: Folder
}
