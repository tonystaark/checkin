import { Module } from '@nestjs/common';
import { MovementsController } from './movements.controller';
import { MovementsService } from './movements.service';
import { UsersModule } from 'src/users/users.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [UsersModule, NotificationModule],
  controllers: [MovementsController],
  providers: [MovementsService],
})
export class MovementsModule { }