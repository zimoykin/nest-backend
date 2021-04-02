import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ApiModel } from './apimodel'
import { User } from './user.entity'
import { Chat } from './chat.entity'

@Entity('message')
export class Message implements ApiModel {
  hasOwner = true
  static relations = ['chat', 'user', 'chat.users']

  output(): any {
    return {
      id: this.id,
      message: this.message,
      chat: this.chat.shortoutput(),
      members: this.chat.users.length,
      user: this.user.shortoutput(),
    }
  }
  shortoutput(): any {
    return {
      id: this.id,
      user: this.user.shortoutput(),
      message: this.message,
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created: Date

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date

  @Column()
  message: string

  @ManyToOne(() => User, (user) => user.messages, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User

  @ManyToOne(() => Chat, (chat) => chat.messages, { nullable: false })
  @JoinColumn({ name: 'chatid' })
  chat: Chat
}
