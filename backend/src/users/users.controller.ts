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
  ) {
    const generatedId = await this.usersService.insertUser(
      userFirstName,
      userLastName,
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

  @Patch(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body('firstName') userFirstName: string,
    @Body('lastName') userLastName: string,
    @Body('mobileNumber') mobileNumber: string,
    @Body('pushToken') pushToken: string,
    @Body('followers') followers?: { mobileNumber: string }[]
  ) {
    const updatedUser = await this.usersService.updateUser(
      userId,
      userFirstName,
      userLastName,
      mobileNumber,
      pushToken,
      followers
    );
    return { message: 'User updated successfully', updatedUser };
  }

  @Delete(':id')
  async removeUser(@Param('id') userId: string) {
    await this.usersService.deleteUser(userId);
    return { message: 'User deleted successfully' };
  }
}