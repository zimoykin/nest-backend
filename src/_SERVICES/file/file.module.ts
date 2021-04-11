import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { File } from '../../_MODEL/file.entity'
import { FileController } from '../../_CONTROLLER/file.controller'
import { UsersModule } from '../user/user.module'
import { FileService } from './file.service'

@Module({
  imports: [TypeOrmModule.forFeature([File]), UsersModule],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
