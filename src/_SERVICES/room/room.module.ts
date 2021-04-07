import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../_MODEL/user.entity';
import { RoomController } from '../../_CONTROLLER/room.controller';
import { RoomService } from './room.service';

@Module({
  imports:[TypeOrmModule.forFeature([User])],
  controllers: [RoomController],
  providers: [RoomService]
})
export class RoomModule {}
