import { Types, Document, Schema } from 'mongoose';

export const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    countryCode: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    pushToken: { type: String, required: true },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    // Notification Preferences
    notificationEnabled: { type: Boolean, default: false, required: true },
    notificationCron: { type: String, default: '0 0 */3 * * *', required: true },
    lastNotifiedAt: { type: Date },
    timezone: { type: String },
    lastMovement: { type: Date },
}, {
    timestamps: true // This automatically adds createdAt and updatedAt fields
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
    // Notification Preferences
    notificationEnabled: boolean,
    notificationCron: string,          // e.g., "0 */3 * * *" (every 3 hours)
    lastNotifiedAt: Date,              // When was the last notification sent
    timezone: string,
    // Timestamps
    createdAt: Date,
    updatedAt: Date,
    lastMovement: Date,
}

export interface Follower { firstName: string, mobileNumber: string, countryCode: string }
