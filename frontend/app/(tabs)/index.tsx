import { Platform, SafeAreaView, StatusBar, View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useNotification } from "@/context/NotificationContext";
import { useState, useEffect } from "react";
import AddFollowersListScreen from "@/components/AddFollowersListScreen";
import { removeWhitespaces } from '@/utils';
import PhoneInput, {
  isValidPhoneNumber, ICountry
} from 'react-native-international-phone-number';

export default function HomeScreen() {
  const { notification, expoPushToken, error, isExistingUser, userFound } = useNotification();
  const [firstName, setfirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [userRegistered, setUserRegistered] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null | undefined>(null);
  if (error) {
    return <ThemedText>Error: {error.message}</ThemedText>;
  }

  const handleInputValue = (phoneNumber: string) => setMobileNumber(phoneNumber);

  const handleSelectedCountry = (country: ICountry | null | undefined) => setSelectedCountry(country);

  const registerUser = async () => {

    try {
      const result = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          countryCode: selectedCountry!.callingCode,
          mobileNumber: removeWhitespaces(mobileNumber),
          pushToken: expoPushToken
        }),
      });
      Alert.alert('Form Submitted', `Name: ${firstName} ${lastName}\nPhone: ${mobileNumber}`);

      const data = await result.json();
      setUserRegistered(true)
      console.log('result', data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (userRegistered) {
      console.log('User has registered!');
    }
  }, [userRegistered]);


  const handleSubmit = () => {
    console.log('JSON', JSON.stringify({
      firstName,
      lastName,
      mobileNumber,
      countryCode: selectedCountry!.callingCode,
      pushToken: expoPushToken
    }))
    if (!isValidPhoneNumber(mobileNumber, selectedCountry)) {
      Alert.alert('Error', 'Phone Number is not in correct format!');
      return;
    }

    if (!firstName || !lastName || !mobileNumber) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    registerUser()
    // checkIsExistingUser()

  };


  const styles = StyleSheet.create({
    container: {
      padding: 20,
      marginTop: 50
    },
    label: {
      fontSize: 16,
      marginVertical: 8
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      paddingHorizontal: 10,
      height: 40
    }
  });

  return (
    <ThemedView
      style={{
        flex: 1,
        padding: 10,
        paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 10,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {userRegistered ? <ThemedText>Registered!</ThemedText> : <ThemedText>Please register yourself</ThemedText>}
        {isExistingUser || userRegistered ?
          <>
            <ThemedText type="subtitle">Latest notification:</ThemedText>
            <ThemedText>{notification?.request.content.title}</ThemedText>
            <ThemedText>
              Hi {userFound.firstName}
            </ThemedText>
            <AddFollowersListScreen user={userFound} />
          </> :
          <>
            <ThemedText type="subtitle">Register:</ThemedText>
            <View style={styles.container}>
              <Text style={styles.label}>Given Name</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setfirstName}
                placeholder="Enter your given name"
              />

              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
              />

              <Text style={styles.label}>Phone Number</Text>

              <View>
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
              </View>
              <Button title="Submit" onPress={handleSubmit} />
            </View>
          </>

        }


      </SafeAreaView>
    </ThemedView>
  );
}