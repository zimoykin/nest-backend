import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './_SERVICES/user/user.module';
import { MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './_UTILS/middleware/logger.middleware';
import { config } from '../ormconfig';
import { TodoModule } from './_SERVICES/todo/todo.module';
import { AuthMiddleware } from './_UTILS/middleware/auth.middleware';
import { FolderModule } from './_SERVICES/folder/folder.module';
import { WsGateway } from './ws.gateway';
import { ChatModule } from './_SERVICES/chat/chat.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(
      config
    ),
    UsersModule, TodoModule, FolderModule, ChatModule
  ],
  controllers: [AppController],
  providers: [AppService, WsGateway],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware).forRoutes('api/user','api/folder', 'api/todo', 'api/chat')
    .apply(LoggerMiddleware).forRoutes('/')
  }
}
