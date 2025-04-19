import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService, PushNotificationService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

@Controller('notifications')
export class PushNotificationController {
  constructor(private readonly pushService: PushNotificationService) { }

  @Post()
  async sendNotification(@Body() body: { token: string; title: string; message: string }) {
    return this.pushService.sendPushNotification(body.token, body.title, body.message);
  }
}