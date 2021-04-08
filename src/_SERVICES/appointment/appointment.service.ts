import { BadRequestException, Injectable } from '@nestjs/common'
import { User } from '../../_MODEL/user.entity'
import { AppointmentDto } from '../../_MODEL/_DTO/appointment.dto'
import { Brackets, getRepository } from 'typeorm'
import { Appointment } from '../../_MODEL/appointment.entity'
import { ModelService } from '../DefaultService/default.service'
import { UserDto } from '../../_MODEL/_DTO/user.dto'

@Injectable()
export class AppointmentService extends ModelService(
  Appointment,
  Appointment.relations
) {
  async checkAdnCreateMeet(input: AppointmentDto, user: User): Promise<any> {
    //1 check
    if (!input.isOnline) {
      const meetDate = new Date(input.appointmentTime)
      const res = await this.repository
        .createQueryBuilder('meet')
        .select()
        .where('meet.room_id = :room', { room: input.room })
        .andWhere(
          `
          meet."appointmentTime" <= :date_to 
          AND :date_from <= (meet."appointmentTime" + meet.duration * interval '1 minute')`,
          {
            date_from: meetDate.toISOString(),
            date_to: new Date(
              meetDate.setMinutes(meetDate.getMinutes() + input.duration)
            ).toISOString(),
          }
        )
        .getOne()
      //2 create
      if (res === undefined) {
        return this.createMeet(input, user)
      } else {
        throw new BadRequestException('occupied')
      }
    } else {
      //create online meet
      this.createMeet(input, user)
    }
  }

  private async createMeet(input: AppointmentDto, user: User): Promise<any> {
    const meet: Appointment = new Appointment()

    for (const key in input) {
      meet[key] = input[key]
    }
    meet.owner = user
    meet.appointmentTime = new Date(input.appointmentTime)
    meet.members = await UserDto.getUsers(input.users)

    //TODO:Email ntfy here
    return (await getRepository(Appointment).save(meet)).output()
  }

  async readMy(user: User): Promise<any> {
    return this.repository
      .createQueryBuilder('meet')
      .select('meet.id')
      .leftJoin('meet.owner', 'owner')
      .leftJoin('meet.members', 'members')
      .where(
        `meet."appointmentTime" + meet.duration * interval '1 minute' >= :date_current`,
        { date_current: new Date() }
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where('meet.owner.id = :userid', {
            userid: user.id,
          }).orWhere('members.id = :userid', { userid: user.id })
        })
      )
      .groupBy('meet.id')
      .getRawMany()
      .then((vals) => {
        return this.repository
          .createQueryBuilder('meet')
          .distinct()
          .leftJoinAndSelect('meet.owner', 'owner')
          .leftJoinAndSelect('meet.members', 'members')
          .where('meet.id In(:...ids)', {
            ids: [null].concat(vals.map((v) => v.meet_id)),
          })
          .getMany()
          .then((meets) => meets.map((meet) => meet.output()))
      })
  }
}
