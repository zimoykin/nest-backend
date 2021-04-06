import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsString,
} from 'class-validator'
import { getRepository, In } from 'typeorm'
import { User } from '../user.entity'
import { CrudDto } from './crud.dto'

export class AppointmentDto implements CrudDto {
  @IsString()
  title: string
  @IsString()
  description: string
  @IsBoolean()
  isOnline: boolean
  @IsNumber()
  duration: number
  @IsNumber()
  room: number
  @IsArray()
  users: [string]
  @IsDateString()
  appointmentTime: string
}
