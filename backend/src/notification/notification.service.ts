import { Injectable, Logger } from '@nestjs/common';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';
import { CronExpressionParser } from 'cron-parser';
import { isAfter } from 'date-fns';

@Injectable()
export class NotificationService {
  getHello(): string {
    return 'Hello World!';
  }
}

@Injectable()
export class PushNotificationService {

  private readonly expo = new Expo();
  private readonly logger = new Logger(PushNotificationService.name);


  async sendPushNotification(expoPushToken: string, title: string, body: string, data: any) {
    if (!Expo.isExpoPushToken(expoPushToken)) {
      this.logger.warn(`Push token ${expoPushToken} is not a valid Expo push token`);
      return;
    }

    const messages: ExpoPushMessage[] = [{
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data,
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
  //   @Cron('*/20 * * * * *') // You can use CronExpression.EVERY_30_SECONDS too
  //   async handleCron() {
  //     this.logger.debug('⏰ Cron polling job running every 5 minutes...');
  //     const usersToFireNotifcations = await this.usersService.findUsersToFireNotification();
  //     const now = new Date();

  //     const checkUsersReadyToFire = usersToFireNotifcations.filter(user => {
  //       try {
  //         const interval = CronExpressionParser.parse(user.notificationCron, {
  //           currentDate: user.lastNotifiedAt || new Date(0),
  //         });
  //         const next = interval.next().toDate();
  //         return isAfter(now, next);
  //       } catch (err) {
  //         this.logger.warn(`Invalid cron for user ${user.id}: ${user.notificationCron}`);
  //         return false;
  //       }
  //     });
  //     await Promise.all(
  //       checkUsersReadyToFire.map(async (user) => {
  //         const data = {
  //           userId: user.id
  //         }
  //         const title = `Hi, ${user.firstName} please tap here`
  //         const message = `Tell your followers that you are doing fine`
  //         await this.pushService.sendPushNotification(user.pushToken, title, message, data)
  //         await this.usersService.updateLastNotifiedAt(user.id, now);
  //       })
  //     );

  //   }
  // }

  @Cron('0 */30 * * * *') // You can use CronExpression.EVERY_30_SECONDS too
  async handleCronToFireNotificationBasedOnLastMovement() {
    this.logger.debug('⏰ Cron polling job running every 30 minutes...');
    const usersToFireNotifcations = await this.usersService.findUsersToFireNotificationBasedOnLastMovement();
    this.logger.debug('Prepare sending Push Notification to followers', usersToFireNotifcations);

    await Promise.all(
      usersToFireNotifcations.map(async (user) => {
        const userFollowersWithObjectIds = user.followers

        await Promise.all(
          userFollowersWithObjectIds!.map(async (followerObjectId) => {
            const follower = await this.usersService.getSingleUserByObjectId(followerObjectId)
            const title = `Hi ${follower.firstName}, ${user.firstName} has been idle for the last 1 hour`
            const message = `Last movement detected was ${user.lastMovement}`
            const data = {
              userId: user.id
            }
            this.logger.debug('Sending Push Notification to follower', follower.id);

            this.pushService.sendPushNotification(follower.pushToken, title, message, data)
            await this.usersService.updateLastNotifiedAt(follower.id, new Date());
          }))

      })
    );

  }
}

@Injectable()
export class NotifyFollowersService {
  private readonly logger = new Logger(NotifyFollowersService.name);
  constructor(
    private readonly pushService: PushNotificationService,
    private usersService: UsersService
  ) { }

  async notify(userId: string) {
    const user = await this.usersService.findUser(userId)
    const userFollowersWithObjectIds = user.followers
    const followersDetailsList = await Promise.all(userFollowersWithObjectIds!.map((id) => this.usersService.getSingleUserByObjectId(id)))
    const data = {
      userId: user.id
    }
    await Promise.all(
      followersDetailsList!.map((follower) => {
        const title = `Hi ${follower.firstName}, ${user.firstName} saying hi`
        const message = `${user.firstName} is doing fine`

        this.pushService.sendPushNotification(follower.pushToken, title, message, data)
      }))
    await user.save();
    this.logger.debug('⏰ User notifying Followers');
  }
}

@Injectable()
export class AcknowledgementFromFirstUserService {
  private readonly logger = new Logger(AcknowledgementFromFirstUserService.name);
  constructor(private readonly notifyFollowersService: NotifyFollowersService) { }

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