import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from './user.entity'
import { ApiModel } from './apimodel'
import { Message } from './message.entity'
import { Folder } from './folder.entity'

@Entity('chat')
export class Chat implements ApiModel {
  hasOwner = false
  static relations = ['users', 'admin', 'folder', 'folder.user']

  output(): any {
    return {
      id: this.id,
      title: this.title,
      folder: (this.folder ? this.folder.shortoutput():''),
      settings: this.settings,
      admin: this.admin.shortoutput(),
      users: this.users.map((val) => {
        return val.shortoutput()
      }),
    }
  }
  shortoutput(): any {
    return {
      id: this.id,
      title: this.title,
      folder: this.folder.shortoutput(),
      users: this.users.map((val) => {
        return val.shortoutput()
      }),
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastChangedDateTime: Date

  @Column({ name: 'settings', type: 'jsonb' })
  settings: any

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'userId' })
  admin: User

  @ManyToOne(() => Folder, (folder) => folder)
  @JoinColumn({ name: 'folderId' })
  folder: Folder

  @OneToMany(() => Message, (message) => message.chat)
  messages: Chat[]

  @ManyToMany(() => User, (user) => user.chats, { cascade: true })
  @JoinTable({
    name: 'chatmembers',
    joinColumn: { name: 'chaId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  users: User[]
}
