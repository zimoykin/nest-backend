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
  
  @Entity('file')
  export class File implements ApiModel {
    hasOwner = true
  
    static relations = []
  
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

    @Column({name: 'holder'})
    holder: string

    @ManyToOne(() => User, (user) => user)
    @JoinColumn({ name: 'UserId' })
    user: User

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created: Date
  
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated: Date
  
  }
  