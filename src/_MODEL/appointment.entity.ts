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
import { ApiModel } from './apimodel'
import { File } from './file.entity'
import { Room } from './room.entity'
import { User } from './user.entity'

@Entity('appointment')
export class Appointment implements ApiModel {
  hasOwner = true
  static relations = ['owner', 'members', 'room', 'files']

  output() {
    return {
      id: this.id,
      title: this.title,
      owner: this.owner.shortoutput(),
      isOnline: this.isOnline,
      files: this.files.map(fl =>fl.shortoutput()),
      duration: this.duration,
      members: this.members.map(user => user.shortoutput()),
      result: this.result,
      appointmentTime: this.appointmentTime,
    }
  }
  shortoutput() {
    return {
      id: this.id,
      title: this.title,
      owner: this.owner.shortoutput(),
      isOnline: this.isOnline,
      duration: this.duration,
      members: this.members.length,
      appointmentTime: this.appointmentTime,
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column()
  description: string

  @Column({ nullable: true })
  result: string

  @Column({ nullable: false })
  isOnline: boolean

  @Column({ nullable: false, type: 'timestamptz' })
  appointmentTime: Date

  @Column({ default: 30 })
  duration: number

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updateAt: Date

  @ManyToOne(() => User, (user) => user, { nullable: false })
  @JoinColumn({ name: 'userId' })
  owner: User

  @ManyToOne(() => Room, (room) => room, { nullable: false })
  @JoinColumn({ name: 'room_id' })
  room: Room

  @OneToMany(() => File, (file) => file.holder)
  files: File[]

  @ManyToMany(() => User, (user) => user.appointments, { cascade: false })
  @JoinTable({
    name: 'meetMembers',
    joinColumn: { name: 'meetId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  members: User[]
}
