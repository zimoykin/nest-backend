import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/user.module';
import { MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { config } from '../ormconfig';
import { TodoModule } from './todo/todo.module';
import { AuthMiddleware } from './middleware/auth.middleware';


@Module({
  imports: [
    TypeOrmModule.forRoot(
      config
    ),
    UsersModule,
    AuthModule,
    TodoModule
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
