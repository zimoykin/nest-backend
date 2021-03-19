import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/user.module';
import { MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { config } from '../ormconfig';
import { TodoModule } from './todo/todo.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { FolderModule } from './folder/folder.module';
import { WsGateway } from './ws.gateway';


@Module({
  imports: [
    TypeOrmModule.forRoot(
      config
    ),
    UsersModule, TodoModule, FolderModule,
  ],
  controllers: [AppController],
  providers: [AppService, WsGateway],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware).forRoutes('api/user','api/folder', 'api/todo')
    .apply(LoggerMiddleware).forRoutes('/')
  }
}
