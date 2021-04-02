import { Module } from '@nestjs/common'
import { Appointment } from '../../_MODEL/appointment.entity'
import { AppointmentController } from '../../_CONTROLLER/appointment.controller'
import { ModelService } from '../DefaultService/default.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppointmentService } from './appointment.service'

@Module({
  imports: [TypeOrmModule.forFeature([Appointment])],
  providers: [AppointmentService],
  exports: [AppointmentService],
  controllers: [AppointmentController],
})
export class AppointmentModule extends ModelService(
  Appointment,
  Appointment.relations
) {}
