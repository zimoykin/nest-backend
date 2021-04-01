import { CacheModule, Module } from '@nestjs/common'
import * as redisStore from 'cache-manager-redis-store'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersService } from './user.service'
import { UserController } from '../../_CONTROLLER/user.controller'
import { User } from '../../_MODEL/user.entity'
import { UserProtectedController } from '../../_CONTROLLER/user-protected.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 600,
      max: 100,
    }),
  ],
  providers: [UsersService],
  controllers: [UserController, UserProtectedController],
  exports: [UsersService],
})
export class UsersModule {}
