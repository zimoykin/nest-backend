import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { ApiModel } from './apimodel';

@Entity('chat')
export class Chat implements ApiModel {

  hasOwner = false;
  static relations = ['users']

  output() : any {
    return { id: this.id, users: this.users.map( val => { return val.shortoutput()}) }
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

  @ManyToMany(() => User, (user: User) => user.chats)
  @JoinTable({ name: "chatmembers" })
  users: User[];

}