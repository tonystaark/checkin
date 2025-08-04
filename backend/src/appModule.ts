import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MovementsModule } from './movements/movements.module';
import { NotificationModule } from './notification/notification.module';

@Module({
    imports: [
        UsersModule,
        ScheduleModule.forRoot(),
        ConfigModule.forRoot(),
        MovementsModule,
        NotificationModule,
        MongooseModule.forRoot(
            `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@checkin.wl6j8q4.mongodb.net/?retryWrites=true&w=majority&appName=CheckIn`,
        ),],
})
export class AppModule { }
