import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController, PushNotificationController, NotifySecondUserController } from './app.controller';
import { AppService, TasksService, PushNotificationService, NotifySecondUserService, AcknowledgementFromFirstUserService } from './app.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  exports: [],
  controllers: [AppController, PushNotificationController, NotifySecondUserController],
  providers: [AppService, PushNotificationService, TasksService, NotifySecondUserService, AcknowledgementFromFirstUserService],
})
export class AppModule { }
