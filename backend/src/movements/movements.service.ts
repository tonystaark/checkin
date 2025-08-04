import { Injectable, Logger } from "@nestjs/common";
import { NotifyFollowersService, PushNotificationService } from "src/notification/notification.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class MovementsService {
  private readonly logger = new Logger(MovementsService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly notifyFollowersService: NotifyFollowersService
  ) { }

  async update(userId: string, timestamp: number) {
    const user = await this.usersService.findUser(userId);
    user.lastMovement = new Date(timestamp);
    await user.save();
    await this.notifyFollowersService.notify(userId);
    return {
      success: true,
      message: 'Movement updated.',
    };
  }
}
