import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoomController } from '../../_CONTROLLER/room.controller'
import { RoomService } from './room.service'
import { Room } from '../../_MODEL/room.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
