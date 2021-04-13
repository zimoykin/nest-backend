import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common'
import { AppointmentDto } from '../_MODEL/_DTO/appointment.dto'
import { AppointmentService } from '../_SERVICES/appointment/appointment.service'
import { RestController } from './rest.controller'
import { Appointment } from '../_MODEL/appointment.entity'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('appointment(meet)')
@Controller('api/appointment')
export class AppointmentController extends RestController(AppointmentService) {
  constructor(public service: AppointmentService) {
    super()
  }

  @Post('')
  @ApiOperation({ summary: 'Create Meet' })
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  @ApiResponse({ status: 200, description: 'Ok.'})
  createMeet(
    @Body(new ValidationPipe()) input: AppointmentDto,
    @Req() req: any
  ): Promise<Appointment> {
    return this.service.checkAdnCreateMeet(input, req.user)
  }

  @Get('')
  @ApiOperation({ summary: 'get all meets available for authorized user and not passed'})
  @ApiResponse({ status: 200, description: 'OK.' })
  readMyMeet(@Req() req: any): Promise<Appointment> {
    return this.service.readMy(req.user)
  }
}
