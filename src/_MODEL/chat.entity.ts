import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { ApiModel } from './apimodel';
import { Message } from './message.entity'

@Entity('chat')
export class Chat implements ApiModel {

  hasOwner = false;
  static relations = ['users', 'admin']

  output() : any {
    return { 
      id: this.id, 
      title: this.title,
      settings: this.settings,
      admin: this.admin.shortoutput(),
      users: this.users.map( val => { return val.shortoutput()}) }
  }
  shortoutput() : any {
    return { 
        id: this.id, 
        title: this.title, 
        users: this.users.map ( val => { return val.shortoutput() })
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastChangedDateTime: Date;

  @Column({name: 'settings', type: 'jsonb'})
  settings: any;

  @ManyToOne(type => User, user => user.folders)
  @JoinColumn({ name: "userId" })
  admin: User;

  @OneToMany( () => Message, (message) => message.chat)
  messages: Chat[];

  @ManyToMany(() => User, (user) => user.chats, { cascade: true })
  @JoinTable({name: 'chatmembers',
    joinColumn: { name: 'chaId', referencedColumnName: 'id'},
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id'}
  })
  users: User[];

}