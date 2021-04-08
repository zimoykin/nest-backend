import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsString,
} from 'class-validator'

export class AppointmentDto {
  @IsString()
  title: string
  @IsString()
  description: string
  @IsBoolean()
  isOnline: boolean
  @IsNumber()
  duration: number
  @IsString()
  room: string
  @IsArray()
  users: [string]
  @IsDateString()
  appointmentTime: string
}
