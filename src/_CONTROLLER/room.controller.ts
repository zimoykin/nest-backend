import { Controller } from '@nestjs/common'
import { RoomService } from '../_SERVICES/room/room.service'
import { RestController } from './rest.controller'

@Controller('api/room')
export class RoomController extends RestController(RoomService) {}
