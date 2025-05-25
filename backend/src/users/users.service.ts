import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

  async insertUser(firstName: string, lastName: string, mobileNumber: string, pushToken: string) {
    const newUser = new this.userModel({
      firstName,
      lastName,
      mobileNumber,
      pushToken
    });
    const result = await newUser.save();
    return result.id as string;
  }

  async getUsers() {
    const users = await this.userModel.find().exec();
    return users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      mobileNumber: user.mobileNumber,
      pushToken: user.pushToken
    }));
  }

  async getSingleUserByPushToken(pushToken: string) {
    const user = await this.findUserByPushToken(pushToken);
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      mobileNumber: user.mobileNumber,
      pushToken: user.pushToken
    };
  }

  async getSingleUserById(userId: string) {
    const user = await this.findUser(userId);
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      mobileNumber: user.mobileNumber,
      pushToken: user.pushToken
    };
  }

  async updateUser(userId: string, firstName: string, lastName: string, mobileNumber: string, pushToken: string, followers?: { mobileNumber: string }[]) {
    const updatedUser = await this.findUser(userId);
    if (firstName) {
      updatedUser.firstName = firstName;
    }
    if (lastName) {
      updatedUser.lastName = lastName;
    }
    if (mobileNumber) {
      updatedUser.mobileNumber = mobileNumber;
    }
    if (pushToken) {
      updatedUser.pushToken = pushToken;
    }
    if (followers && followers.length > 0) {
      updatedUser.followers = followers;
    }
    const savedUser = await updatedUser.save();
    return savedUser;
  }

  async deleteUser(userId: string) {
    const result = await this.userModel.deleteOne({ _id: userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find user.');
    }
  }

  private async findUser(id: string): Promise<User> {
    let user;
    try {
      user = await this.userModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find user.');
    }
    if (!user) {
      throw new NotFoundException('Could not find user.');
    }
    return user;
  }

  private async findUserByPushToken(pushToken: string): Promise<User> {
    let user;
    try {
      user = await this.userModel.findOne({ pushToken }).exec();
    } catch (error) {
      throw new NotFoundException('Could not find user.');
    }
    if (!user) {
      throw new NotFoundException('Could not find user.');
    }
    return user;
  }
}