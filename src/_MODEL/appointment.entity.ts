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
import { ApiProperty } from '@nestjs/swagger';
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
      files: this.files.map((fl) => fl.shortoutput()),
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

  @ApiProperty({example: 'Introduction',type: 'string', description: 'name of meet'})
  @Column()
  title: string

  @ApiProperty({example: 'something something here', description: 'description of meet or/and meetings plan'})
  @Column()
  description: string

  @ApiProperty({example: 'something about reuslts after this meet', description: 'results of meet'})
  @Column({ nullable: true })
  result: string

  @ApiProperty({example: true, description: 'online/offline meet, offline meeting should be available for time and room'})
  @Column({ nullable: false })
  isOnline: boolean

  @ApiProperty({example: new Date(), description: 'start time of meet'})
  @Column({ nullable: false, type: 'timestamptz' })
  appointmentTime: Date

  @ApiProperty({example: 30, description: 'meet duration in minutes'})
  @Column({ default: 30 })
  duration: number

  @ApiProperty({example: new Date(), description: 'time when it was created'})
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @ApiProperty({example: new Date(), description: 'time of the last updated'})
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updateAt: Date

  @ApiProperty({description: 'Who have created it (who is owner of this meet.)'})
  @ManyToOne(() => User, (user) => user, { nullable: false })
  @JoinColumn({ name: 'userId' })
  owner: User

  @ApiProperty({type: Room, description: 'link of the meeting room, only for offline'})
  @ManyToOne(() => Room, (room) => room, { nullable: false })
  @JoinColumn({ name: 'room_id' })
  room: Room

  @ApiProperty({type: File, description: 'Files of this meet'})
  @OneToMany(() => File, (file) => file.holder)
  files: File[]

  @ApiProperty({type: User, description: 'members of this meet'})
  @ManyToMany(() => User, (user) => user.appointments, { cascade: false })
  @JoinTable({
    name: 'meetMembers',
    joinColumn: { name: 'meetId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  members: User[]
}
