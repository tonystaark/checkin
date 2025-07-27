import { Module } from '@nestjs/common';
import { MovementsController } from './movements.controller';
import { MovementsService } from './movements.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [MovementsController],
  providers: [MovementsService],
})
export class MovementsModule { }