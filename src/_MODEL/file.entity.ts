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
  import { ApiModel } from './apimodel'
import { Appointment } from './appointment.entity'
  import { User } from './user.entity'
  
  @Entity('file')
  @Unique(['title', 'user'])
  export class File implements ApiModel {
    hasOwner = true
  
    static relations = ['user']
  
    output(): any {
      return {
        id: this.id,
        title: this.title,
        user: this.user.shortoutput(),
        object: this.holder
      }
    }
    shortoutput(): any {
      return { 
          id: this.id,
          title: this.title
        }
    }
  
    @PrimaryGeneratedColumn('uuid')
    id: string
  
    @Column()
    title: string

    @Column()
    extension: string

    @ManyToOne(() => Appointment, (meet) => meet)
    @Column('uuid', {name: 'holder'})
    holder: string

    @ManyToOne(() => User, (user) => user,  { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created: Date
  
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated: Date
  
  }
  