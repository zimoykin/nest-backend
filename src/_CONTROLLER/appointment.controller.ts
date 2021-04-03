import { Body, Controller, Post, Req, ValidationPipe } from '@nestjs/common'
import { AppointmentDto } from '../_MODEL/_DTO/appointment.dto'
import { WsGateway } from '../ws.gateway'
import { AppointmentService } from '../_SERVICES/appointment/appointment.service'
import { RestController } from './rest.controller'
import { Appointment } from '../_MODEL/appointment.entity'

@Controller('api/appointment')
export class AppointmentController extends RestController(AppointmentService) {

    constructor(public service: AppointmentService) {
        super()
      }
    
      @Post('')
      createMessage(
        @Body(new ValidationPipe()) input: AppointmentDto,
        @Req() req: any
      ): Promise<Appointment> {
        return this.service.checkAdnCreateMeet(input, req.user)
      }

      
}
