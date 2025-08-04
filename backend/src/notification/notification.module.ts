import { Module } from '@nestjs/common';
import { NotificationController, PushNotificationController, NotifyFollowersController } from './notification.controller';
import { NotificationService, TasksService, PushNotificationService, NotifyFollowersService, AcknowledgementFromFirstUserService } from './notification.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [NotificationController, PushNotificationController, NotifyFollowersController],
  providers: [NotificationService, TasksService, PushNotificationService, NotifyFollowersService, AcknowledgementFromFirstUserService],
  exports: [NotifyFollowersService]
})
export class NotificationModule { }
