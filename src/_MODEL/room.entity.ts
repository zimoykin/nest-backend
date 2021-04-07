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
import { Appointment } from './appointment.entity'
  
  @Entity('room')
  @Unique(['title'])
  export class Room implements ApiModel {
    hasOwner = true
  
    static relations = [
      'appointments'
    ]
  
    output(): any {
      return {
        id: this.id,
        title: this.title,
        folder: this.appointments.map( val=> val.shortoutput())
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
  
    @OneToMany(() => Appointment, (meet) => meet.room)
    @JoinColumn({ name: 'meet_id' })
    appointments: Appointment[]

  }
  