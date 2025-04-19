import { Module } from '@nestjs/common';
import { AppController, PushNotificationController } from './app.controller';
import { AppService, PushNotificationService } from './app.service';

@Module({
  imports: [],
  exports: [],
  controllers: [AppController, PushNotificationController],
  providers: [AppService, PushNotificationService],
})
export class AppModule { }
