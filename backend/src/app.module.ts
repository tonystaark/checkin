import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { AppController, PushNotificationController, NotifyFollowersController } from './app.controller';
import { AppService, TasksService, PushNotificationService, NotifyFollowersService, AcknowledgementFromFirstUserService } from './app.service';

@Module({
  imports: [
    UsersModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@checkin.wl6j8q4.mongodb.net/?retryWrites=true&w=majority&appName=CheckIn`,
    ),],
  exports: [],
  controllers: [AppController, PushNotificationController, NotifyFollowersController],
  providers: [AppService, PushNotificationService, TasksService, NotifyFollowersService, AcknowledgementFromFirstUserService],
})
export class AppModule { }
