import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { User, Follower } from './users.entity';


@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

  async insertUser(firstName: string, lastName: string, countryCode: string, mobileNumber: string, pushToken: string) {
    const newUser = new this.userModel({
      firstName,
      lastName,
      countryCode,
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
      countryCode: user.countryCode,
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
      countryCode: user.countryCode,
      mobileNumber: user.mobileNumber,
      pushToken: user.pushToken
    };
  }

  async getSingleUserByMobileNumber(countryCode: string, mobileNumber: string) {
    const user = await this.findUserByMobileNumber(countryCode, mobileNumber);
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      countryCode: user.countryCode,
      mobileNumber: user.mobileNumber,
      pushToken: user.pushToken,
      followers: user.followers,
      followees: user.followees
    };
  }

  async getSingleUserByObjectId(objectId: Types.ObjectId): Promise<User> {
    return await this.findUserByObjectId(objectId);
  }

  async getSingleUserById(userId: string) {
    const user = await this.findUser(userId);
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      countryCode: user.countryCode,
      mobileNumber: user.mobileNumber,
      pushToken: user.pushToken,
      followers: user.followers,
      followees: user.followees
    };
  }

  async followUser(userId: string, targetUserId: string): Promise<void> {
    console.log('check')
    // if (userId === targetUserId) {
    //   throw new Error('User cannot follow themselves.');
    // }

    const [user, targetUser] = await Promise.all([
      this.findUser(userId),
      this.findUser(targetUserId)
    ]);

    if (!user || !targetUser) {
      throw new Error('User or target user not found.');
    }

    // Add to followees if not already following
    if (!user.followees?.includes(targetUser._id)) {
      user.followees!.push(targetUser._id);
    }

    // Add to followers if not already followed
    if (!targetUser.followers?.includes(user._id)) {
      targetUser.followers!.push(user._id);
    }

    await Promise.all([user.save(), targetUser.save()]);
  }

  async deleteUser(userId: string) {
    const result = await this.userModel.deleteOne({ _id: userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find user.');
    }
  }

  async findUsersToFireNotification(): Promise<User[]> {
    let users;
    try {
      users = await this.userModel.find({
        followers: { $exists: true, $not: { $size: 0 } },
      }).exec();
      if (users.length === 0) {
        throw new NotFoundException('No users with followers found.');
      }
      return users;
    } catch (error) {
      throw new NotFoundException('Could not find users.');
    }
  }

  async findUsersToFireNotificationBasedOnLastMovement(): Promise<User[]> {
    try {
      const timeLapsed = new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
      return await this.userModel.find({
        followers: { $exists: true, $not: { $size: 0 } },
        lastMovement: { $exists: true, $lte: timeLapsed },
      }).exec();
    } catch (error) {
      throw new NotFoundException('Could not find users.');
    }
  }

  async updateLastNotifiedAt(userId: string, currentDate: Date) {
    const user = await this.findUser(userId)
    user.lastNotifiedAt = currentDate
    await user.save();
  }


  async findUser(id: string): Promise<User> {
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

  private async findUserByObjectId(objectId: Types.ObjectId): Promise<User> {
    let user;
    try {
      user = await this.userModel.findById(objectId).exec();
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

  private async findUserByMobileNumber(countryCode: string, mobileNumber: string): Promise<User> {
    let user;
    try {
      user = await this.userModel.findOne({ countryCode, mobileNumber }).exec();
    } catch (error) {
      throw new NotFoundException('Could not find user.');
    }
    if (!user) {
      throw new NotFoundException('Could not find user.');
    }
    return user;
  }

}