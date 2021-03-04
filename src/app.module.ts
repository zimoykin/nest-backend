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
import { FolderService } from './folder/folder.service';
import { OutputModule } from './output/output.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(
      config
    ),
    UsersModule, TodoModule, FolderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware).forRoutes('api')
    .apply(LoggerMiddleware).forRoutes('/')
  }
}
