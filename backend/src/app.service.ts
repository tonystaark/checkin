import { Injectable, Logger } from '@nestjs/common';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from './users/users.service';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World Hello!';
  }
}

@Injectable()
export class PushNotificationService {

  private readonly expo = new Expo();
  private readonly logger = new Logger(PushNotificationService.name);


  async sendPushNotification(expoPushToken: string, title: string, body: string) {
    if (!Expo.isExpoPushToken(expoPushToken)) {
      this.logger.warn(`Push token ${expoPushToken} is not a valid Expo push token`);
      return;
    }

    const messages: ExpoPushMessage[] = [{
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data: { withSome: 'data' },
    }];

    const chunks = this.expo.chunkPushNotifications(messages);

    const tickets: ExpoPushTicket[] = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        this.logger.log('Ticket chunk', ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        this.logger.error('Error sending notification chunk', error);
      }
    }

    return tickets;
  }
}

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private readonly pushService: PushNotificationService,
    private usersService: UsersService
  ) { }

  // Runs every 30 seconds
  @Cron('0 */5 * * * *') // You can use CronExpression.EVERY_30_SECONDS too
  async handleCron() {
    this.logger.debug('⏰ Cron job running every 10 seconds...');
    // Your custom logic here
    const token = "ExponentPushToken[DxqWu5I-4i5bg5r2Rrc69L]"
    const title = "CRON from local computer"
    const message = "CRON:This is a test notification 2"
    const usersToFireNotifcations = await this.usersService.findUsersToFireNotification();
    await Promise.all(
      usersToFireNotifcations.map((user) => this.pushService.sendPushNotification(user.pushToken, title, message))
    );

  }
}


@Injectable()
export class NotifySecondUserService {
  private readonly logger = new Logger(NotifySecondUserService.name);
  constructor(private readonly pushService: PushNotificationService) { }

  notify(acknowledged: boolean) {
    if (acknowledged === true) {
      this.logger.debug('⏰ User 1 notifying User 2');
      const token = "ExponentPushToken[DxqWu5I-4i5bg5r2Rrc69L]"
      const title = "User 1 notifying User 2"
      const message = "User 1 notifying User 2"
      this.pushService.sendPushNotification(token, title, message);
    }
  }
}

@Injectable()
export class AcknowledgementFromFirstUserService {
  private readonly logger = new Logger(AcknowledgementFromFirstUserService.name);
  constructor(private readonly notifySecondUserService: NotifySecondUserService) { }

  acknowledge(acknowledge: boolean) {
    if (acknowledge === true) {
      console.log('notify success')
      return {
        success: true,
        message: 'Acknowledgment received.',
      };
    } else {
      return {
        success: false,
        message: 'Invalid request data.',
      };
    }
  }
}
