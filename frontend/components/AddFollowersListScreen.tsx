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

interface User {
  id: string;
  name: string;
  mobileNumber: string;
}

export default function AddFollowersListScreen() {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  const handleAddUser = () => {
    if (!name || !mobileNumber) {
      Alert.alert('Validation', 'Please enter both name and mobile number');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      mobileNumber,
    };

    setUsers(prevUsers => [...prevUsers, newUser]);
    setName('');
    setMobileNumber('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add User</Text>
      <TextInput
        placeholder="Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Mobile Number"
        style={styles.input}
        value={mobileNumber}
        keyboardType="phone-pad"
        onChangeText={setMobileNumber}
      />

      <Button title="Add User" onPress={handleAddUser} />

      <Text style={styles.subtitle}>User List</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text>{item.name} - {item.mobileNumber}</Text>
          </View>
        )}
      />
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
