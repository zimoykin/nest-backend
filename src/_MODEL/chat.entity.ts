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
import { ApiProperty } from '@nestjs/swagger'

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
      })
    }
  }
  shortoutput(): any {
    return {
      id: this.id,
      title: this.title,
      folder: (this.folder ? this.folder.shortoutput():''),
      users: this.users.map((val) => {
        return val.shortoutput()
      })
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({example: 'Tom Delorean', type: 'string', description: 'chat name'})
  @Column()
  title: string

  @ApiProperty({example: new Date(), type: Date, description: 'created'})
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date

  @ApiProperty({example: new Date(), type: Date, description: 'updated'})
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastChangedDateTime: Date

  @ApiProperty({example: { something: 'here'}, type: 'jsonb', description: 'chat settings'})
  @Column({ name: 'settings', type: 'jsonb' })
  settings: any

  @ApiProperty({example: 'Admin', type: User, description: 'admin, creator'})
  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'userId' })
  admin: User

  @ApiProperty({example: 'root', type: Folder, description: 'folder'})
  @ManyToOne(() => Folder, (folder) => folder)
  @JoinColumn({ name: 'folderId' })
  folder: Folder

  @ApiProperty({example: ['helo', 'Hello!'], type: [Chat], description: 'messages'})
  @OneToMany(() => Message, (message) => message.chat)
  messages: Chat[]

  @ApiProperty({example: '', type: [User], description: 'members'})
  @ManyToMany(() => User, (user) => user.chats, { cascade: true })
  @JoinTable({
    name: 'chatmembers',
    joinColumn: { name: 'chaId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  users: User[]
}
