import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async addUser(
    @Body('firstName') userFirstName: string,
    @Body('lastName') userLastName: string,
    @Body('mobileNumber') mobileNumber: string,
    @Body('pushToken') pushToken: string,
    @Body('countryCode') countryCode: string,
  ) {
    const generatedId = await this.usersService.insertUser(
      userFirstName,
      userLastName,
      countryCode,
      mobileNumber,
      pushToken
    );
    return { message: 'User added successfully', id: generatedId };
  }

  @Get()
  async getAllUsers() {
    const users = await this.usersService.getUsers();
    return { message: 'All users retrieved successfully', users };
  }

  @Get('by-id/:id')
  getUser(@Param('id') userId: string) {
    return this.usersService.getSingleUserById(userId);
  }

  @Get('by-push-token/:pushToken')
  getUserByPushToken(@Param('pushToken') pushToken: string) {
    return this.usersService.getSingleUserByPushToken(pushToken);
  }

  @Get('by-mobile-number/:countryCode/:mobileNumber')
  getUserByMobileNumber(
    @Param('countryCode') countryCode: string,
    @Param('mobileNumber') mobileNumber: string
  ) {
    console.log(countryCode, mobileNumber)

    return this.usersService.getSingleUserByMobileNumber(countryCode, mobileNumber);
  }

  @Patch(':userId/:targetUserId')
  async followUser(
    @Param('userId') userId: string,
    @Param('targetUserId') targetUserId: string
  ) {
    const updatedUser = await this.usersService.followUser(
      userId,
      targetUserId
    );
    return { message: 'User updated successfully', updatedUser };
  }

  @Delete(':id')
  async removeUser(@Param('id') userId: string) {
    await this.usersService.deleteUser(userId);
    return { message: 'User deleted successfully' };
  }
}