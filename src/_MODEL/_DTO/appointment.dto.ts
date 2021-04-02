import { IsArray, IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator'
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
  members: [string]
  @IsDateString()
  appointmentTime: string
}