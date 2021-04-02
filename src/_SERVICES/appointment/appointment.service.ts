import { Injectable } from '@nestjs/common'
import { AppointmentDto } from 'src/_MODEL/_DTO/appointment.dto'
import { Appointment } from '../../_MODEL/appointment.entity'
import { ModelService } from '../DefaultService/default.service'

@Injectable()
export class AppointmentService extends ModelService(
  Appointment,
  Appointment.relations
) {

  async createMeet(input: AppointmentDto, req: any):Promise<Appointment> {

    //1 check 
    if (!input.isOnline) {

      const meetDate = new Date(input.appointmentTime)
      const res = await this.repository.createQueryBuilder('meet')
      .select()
      .where('meet.room = :room', {room: input.room})
      .andWhere('meet. "appointmentTime" BETWEEN :date_from AND :date_to', 
        { date_from:  meetDate.toISOString(), 
          date_to: new Date (meetDate.setMinutes(meetDate.getMinutes() + input.duration)).toISOString() 
        })
      .getOne()

      if (!res) { 
        console.log('not occupied')
      } else {
        console.log('occupied')
      }
    }

    return 

  }

}




// SELECT
// 	Count(meet.id) > 0 AS occupied
// FROM
// 	appointment AS meet
// WHERE
// 	meet.room = 1
// 	AND(meet. "appointmentTime" BETWEEN CURRENT_TIMESTAMP
// 		AND CURRENT_TIMESTAMP + 30 * interval '1 minute');