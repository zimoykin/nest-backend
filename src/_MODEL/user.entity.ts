import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm'
import * as bcrypt from 'bcrypt'
import { Todo } from './todo.entity'
import { Folder } from './folder.entity'
import { ApiModel } from './apimodel'
import { Chat } from './chat.entity'
import { Message } from './message.entity'
import { Gender } from '../_UTILS/enums/genders'
import { Roles } from '../_UTILS/enums/roles'
import { Appointment } from './appointment.entity'

@Entity('user')
export class User implements ApiModel {
  hasOwner = false
  static relations: string[] = ['todos', 'folders', 'folders.todos', 'chats']

  output(): any {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      gender: this.gender,
      role: this.role,
      photo: this.photo,
      folder: this.folders.map((val) => {
        return {
          id: val.id,
          title: val.title,
          description: val.descr,
          todos: val.todos.length || 0,
        }
      }),
    }
  }

  shortoutput(): any {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      photo: this.photo,
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false })
  username: string

  @Column({ nullable: false })
  password: string

  @Column({ unique: true, nullable: false })
  email: string

  @Column({ default: Gender.other, nullable: false })
  gender: Gender

  @Column({ nullable: false })
  role: Roles

  @Column({ nullable: true, default: 'nophoto.jpg' })
  photo: string

  @Column({ nullable: true })
  refreshToken: string

  @Column({ type: 'boolean', default: true })
  isActive: boolean

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastChangedDateTime: Date

  @OneToMany(() => Todo, (todo) => todo.user, { cascade: true })
  todos: Todo[]

  @OneToMany(() => Folder, (folder) => folder.user, { cascade: true })
  folders: Folder[]

  @ManyToMany(() => Chat, (chat) => chat.users, { eager: true })
  chats: Chat[]

  @ManyToMany(() => Appointment, (meet) => meet.members, { eager: true })
  appointments: Appointment[]

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[]

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10)
  }

}
