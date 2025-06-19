import { ICountry } from 'react-native-international-phone-number';

export interface User {
    _id: string;
    id: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    countryCode: ICountry["callingCode"];
    pushToken: string;
    followers?: string[];
    followees?: string[];
}