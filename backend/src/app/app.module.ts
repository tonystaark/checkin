import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController, PushNotificationController, NotifySecondUserController } from './app.controller';
import { AppService, TasksService, PushNotificationService, NotifySecondUserService, AcknowledgementFromFirstUserService } from './app.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@checkin.wl6j8q4.mongodb.net/?retryWrites=true&w=majority&appName=CheckIn`,
    ),],
  exports: [],
  controllers: [AppController, PushNotificationController, NotifySecondUserController],
  providers: [AppService, PushNotificationService, TasksService, NotifySecondUserService, AcknowledgementFromFirstUserService],
})
export class AppModule { }
