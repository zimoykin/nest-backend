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
import { MessageModule } from './_SERVICES/message/message.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

let modules = [TypeOrmModule.forRoot(config), 
  UsersModule, TodoModule, FolderModule, ChatModule, MessageModule,
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'uploads'),
    exclude: ['api/*']
  })]

@Module({
  imports: modules,
  controllers: [AppController],
  providers: [AppService, WsGateway],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware).forRoutes('api/user','api/folder', 'api/todo', 'api/chat', 'api/message')
    .apply(LoggerMiddleware).forRoutes('/')
  }
}
