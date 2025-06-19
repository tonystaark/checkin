import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import FollowRow from './FollowRow';
import PhoneInput, {
  isValidPhoneNumber, ICountry
} from 'react-native-international-phone-number';
import { User } from "../types/index"
import { useNotification } from "@/context/NotificationContext";

export default function AddFollowersListScreen({ user }: User) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [followersFound, setFollowersFound] = useState<User>({});
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null | undefined>(null);
  const { userFound } = useNotification();

  const handleInputValue = (phoneNumber: string) => setMobileNumber(phoneNumber.replace(/\s+/g, ''));
  const handleSelectedCountry = (country: ICountry | null | undefined) => setSelectedCountry(country);

  const handleFindUser = async () => {
    if (!mobileNumber) {
      Alert.alert('Validation', 'Please enter both name and mobile number');
      return;
    }

    try {
      const result = await fetch(`http://192.168.0.229:3000/users/by-mobile-number/${selectedCountry?.callingCode}/${mobileNumber.replace(/\s+/g, '')}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await result.json();
      setFollowersFound(data)
      console.log('followerfound', data)
    }

    catch (error) {
      console.log(error)
    }
  }

  const onFollow = async () => {
    try {
      const result = await fetch(`http://192.168.0.229:3000/users/${userFound.id}/${followersFound.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await result.json();
      console.log('addedFollower', data)
    }

    catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find People to Follow</Text>

      <PhoneInput
        value={mobileNumber}
        onChangePhoneNumber={handleInputValue}
        selectedCountry={selectedCountry}
        onChangeSelectedCountry={handleSelectedCountry}
      />
      <View style={{ marginTop: 10 }}>
        <Text>
          Country:{' '}
          {`${selectedCountry?.name?.en} (${selectedCountry?.cca2})`}
        </Text>
        <Text>
          Phone Number:{' '}
          {`${selectedCountry?.callingCode} ${mobileNumber}`}
        </Text>
        <Text>
          isValid:{' '}
          {isValidPhoneNumber(mobileNumber, selectedCountry)
            ? 'true'
            : 'false'}
        </Text>
      </View>
      <Button title="Find User" onPress={handleFindUser} />

      {followersFound &&
        <>
          <Text style={styles.subtitle}>Followee List</Text>
          <FollowRow followerFound={followersFound} userFound={userFound} onFollow={onFollow} />
        </>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 16,
  },
  input: {
    height: 40,
    borderColor: '#888',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  userItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});
