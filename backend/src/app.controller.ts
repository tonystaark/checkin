import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService, PushNotificationService, NotifyFollowersService, AcknowledgementFromFirstUserService } from './app.service';

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
  async sendNotification(@Body() body: { token: string; title: string; message: string, data: any }) {
    return this.pushService.sendPushNotification(body.token, body.title, body.message, body.data);
  }
}

@Controller(`notify-followers/:userId`)
export class NotifyFollowersController {
  constructor(private readonly notifyService: NotifyFollowersService) { }

  @Post()
  async sendNotification(@Param('userId') userId: string) {
    return this.notifyService.notify(userId);
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