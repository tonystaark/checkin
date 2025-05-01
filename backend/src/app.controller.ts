import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService, PushNotificationService, NotifySecondUserService, AcknowledgementFromFirstUserService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

@Controller('notify')
export class PushNotificationController {
  constructor(private readonly pushService: PushNotificationService) { }

  @Post()
  async sendNotification(@Body() body: { token: string; title: string; message: string }) {
    return this.pushService.sendPushNotification(body.token, body.title, body.message);
  }
}

@Controller('notifyseconduser')
export class NotifySecondUserController {
  constructor(private readonly notifyService: NotifySecondUserService) { }

  @Post()
  async sendNotification(@Body() body: { acknowledged: boolean }) {
    return this.notifyService.notify(body.acknowledged);
  }
}
// @Controller('acknowledge')
// export class AcknowledgeController {
//   constructor(private readonly acknowledgementFromFirstUserService: AcknowledgementFromFirstUserService) { }

//   @Post()
//   async acknowledge(@Body() body: { acknowledgement: boolean }) {
//     return this.acknowledgementFromFirstUserService.acknowledge(body.acknowledgement);
//   }
// }