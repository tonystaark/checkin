import { Injectable, Logger } from '@nestjs/common';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';

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