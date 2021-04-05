import { Injectable } from '@nestjs/common'
import { User } from '../../_MODEL/user.entity'
import { AppointmentDto } from '../../_MODEL/_DTO/appointment.dto'
import { getRepository } from 'typeorm'
import { Appointment } from '../../_MODEL/appointment.entity'
import { ModelService } from '../DefaultService/default.service'

@Injectable()
export class AppointmentService extends ModelService(
  Appointment,
  Appointment.relations
) {

  async checkAdnCreateMeet(input: AppointmentDto, user: User):Promise<any> {

    //1 check 
    if (!input.isOnline) {
      const meetDate = new Date(input.appointmentTime)
      const res = await this.repository.createQueryBuilder('meet')
      .select()
      .where('meet.room = :room', {room: input.room})
      .andWhere(`
          meet."appointmentTime" <= :date_to 
          AND :date_from <= (meet."appointmentTime" + meet.duration * interval '1 minute')  
        `, { date_from: meetDate.toISOString(), 
          date_to: new Date (meetDate.setMinutes(meetDate.getMinutes() + input.duration)).toISOString() 
        })
      .getOne()
      //2 create
      if (res === undefined) { 
        return this.createMeet(input, user)
      } else {
        return {status: 'occupied'}
      }
    } else {
      //create online meet
      this.createMeet(input, user)
    }

  }

  private async createMeet(input: AppointmentDto, user: User):Promise<any>{

    const repo = getRepository(Appointment)
    
    let meet:Appointment = new Appointment()

    for (let key in input) {
      meet[key] = input[key]
    }
    meet.owner = user

    //FIXME: ???? 
    meet.appointmentTime = new Date(new Date(input.appointmentTime).toUTCString())

    meet.members = await AppointmentDto.getUsers(input.users)

    //TODO:Email ntfy here
    return (await repo.save(meet)).output()

  }


  async readMy(user: User):Promise<any> {

    return this.repository.createQueryBuilder('meet')
    .distinct()
    .leftJoinAndSelect('meet.owner', 'owner')
    .leftJoinAndSelect('meet.members','members')
    .where('meet.owner.id = :userid OR members.id = :userid', {userid: user.id})
    .getMany().then( vals => vals.map(val => val.output()))

  }

}

// SELECT
// 	"meet"."id" AS "meet_id",
// 	meet. "appointmentTime" AS "START",
// 	meet. "appointmentTime" + "meet"."duration" * interval '1 minute' AS "END"
// FROM
// 	"appointment" AS "meet"
// WHERE
// 	meet.room = 1
// 	AND meet. "appointmentTime" <= '2021-04-02 23:09:42.937106'
// 	AND '2021-04-02 19:30:52.937106'<= (meet. "appointmentTime" + "meet"."duration" * interval '1 minute')