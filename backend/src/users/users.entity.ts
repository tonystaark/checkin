import { Types, Document, Schema } from 'mongoose';

export const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    countryCode: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    pushToken: { type: String, required: true },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followees: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

export interface User extends Document {
    _id: Types.ObjectId;
    id: string;
    firstName: string;
    lastName: string;
    countryCode: string;
    mobileNumber: string;
    pushToken: string;
    followers?: (Types.ObjectId)[];
    followees?: (Types.ObjectId)[];
}

export interface Follower { firstName: string, mobileNumber: string, countryCode: string }
