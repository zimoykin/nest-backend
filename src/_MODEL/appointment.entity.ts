import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ApiModel } from './apimodel'
import { User } from './user.entity'

@Entity('appointment')
export class Appointment implements ApiModel {
  hasOwner = true
  static relations = ['owner', 'members']

  output() {
    return {
      id: this.id,
      title: this.title,
      owner: this.owner.shortoutput(),
      isOnline: this.isOnline,
      duration: this.duration,
      members: this.members.map((user) => user.shortoutput()),
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

  @Column({nullable: true})
  result: string

  @Column({ nullable: false })
  isOnline: boolean

  @Column({ default: 0 })
  room: number

  @Column({ nullable: false, type: 'timestamptz'})
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

  @ManyToMany(() => User, (user) => user.appointments, { cascade: false })
  @JoinTable({
    name: 'meetMembers',
    joinColumn: { name: 'meetId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  members: User[]
}
