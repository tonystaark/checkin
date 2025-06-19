import { ICountry } from 'react-native-international-phone-number';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    countryCode: ICountry["callingCode"];
    pushToken: string;
    followers?: { mobileNumber: string }[]
}