import { Injectable } from '@nestjs/common'
import { Room } from '../../_MODEL/room.entity'
import { ModelService } from '../DefaultService/default.service'

@Injectable()
export class RoomService extends ModelService(Room, Room.relations) {}
