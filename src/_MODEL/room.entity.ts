import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'
import { ApiModel } from './apimodel'

@Entity('room')
@Unique(['title'])
export class Room implements ApiModel {
  hasOwner = false
  static relations = []

  output(): any {
    return {
      id: this.id,
      title: this.title,
    }
  }
  shortoutput(): any {
    return { id: this.id, title: this.title }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created: Date

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date
}
