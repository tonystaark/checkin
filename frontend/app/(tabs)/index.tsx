import { Platform, SafeAreaView, StatusBar, View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useNotification } from "@/context/NotificationContext";
import { useEffect, useState } from "react";
export default function HomeScreen() {
  const { notification, expoPushToken, error } = useNotification();
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [firstName, setfirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setmobileNumber] = useState('');
  const [userFound, setUserFound] = useState({ firstName: '', lastName: '', mobileNumber: '', pushToken: '' })
  if (error) {
    return <ThemedText>Error: {error.message}</ThemedText>;
  }

  const checkIsExistingUser = async () => {
    console.log('expoPushToken', expoPushToken)
    try {
      const result = await fetch(`http://192.168.1.122:3000/users/by-push-token/${expoPushToken}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await result.json();

      if (data.pushToken) {
        console.log('data222', data)
        setUserFound({
          firstName: data.firstName,
          lastName: data.lastName,
          mobileNumber: data.mobileNumber,
          pushToken: data.pushToken
        })
        return setIsExistingUser(true)
      }
      setIsExistingUser(false)
      return data;
    } catch (error) {
      setIsExistingUser(false)
      console.log(error)
    }
  }

  const registerUser = async () => {
    console.log('JSON', JSON.stringify({
      firstName,
      lastName,
      mobileNumber,
      pushToken: expoPushToken
    }))
    try {
      const result = await fetch(`http://192.168.1.122:3000/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          mobileNumber,
          pushToken: expoPushToken
        }),
      });
      Alert.alert('Form Submitted', `Name: ${firstName} ${lastName}\nPhone: ${mobileNumber}`);

      const data = await result.json();
      console.log('result', data)

      Alert.alert('Form Submitted', `Name: ${firstName} ${lastName}\nPhone: ${mobileNumber}`);
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = () => {
    if (!firstName || !lastName || !mobileNumber) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    registerUser()
    checkIsExistingUser()

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

  useEffect(() => {
    console.log('somethingg')
    checkIsExistingUser()
  }, [])

  return (
    <ThemedView
      style={{
        flex: 1,
        padding: 10,
        paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 10,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedText type="subtitle" style={{ color: "red" }}>
          Your push token:
        </ThemedText>
        <ThemedText>{expoPushToken}</ThemedText>
        {isExistingUser ?
          <>
            <ThemedText type="subtitle">Latest notification:</ThemedText>
            <ThemedText>{notification?.request.content.title}</ThemedText>
            <ThemedText>
              Hi {userFound.firstName}
            </ThemedText>
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
              <TextInput
                style={styles.input}
                value={mobileNumber}
                onChangeText={setmobileNumber}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />

              <Button title="Submit" onPress={handleSubmit} />
            </View>
          </>

        }


      </SafeAreaView>
    </ThemedView>
  );
}