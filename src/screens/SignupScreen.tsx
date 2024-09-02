import React, { useState } from 'react';
import { SafeAreaView, View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import BackgroundWrapper from '../components/BackgroundWrapper';

type RootStackParamList = {
  Signup: undefined;
  Login: undefined;
  Home: { error?: boolean };
};

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;

type SignupScreenProps = {
  navigation: SignupScreenNavigationProp;
};

function SignupScreen({ navigation }: SignupScreenProps): React.JSX.Element {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const default_ip = '192.168.1.43'; // Your ESP32 IP address

  const handleGetOtpSn = async () => {
    try {
      const response = await fetch(`http://${default_ip}/get-otp-sn`);
      if (!response.ok) {
        throw new Error('Failed to get S/N and OTP from ESP32');
      }
      const data = await response.json();
      setSerialNumber(data.serialNumber);
      setOtp(data.otp);
      Alert.alert('Success', 'S/N and OTP retrieved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to retrieve S/N and OTP');
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://34.30.244.244/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          otp: otp,
          serialNumber: serialNumber,
        }),
      });

      if (response.status === 201) {
        const data = await response.json();
        Alert.alert('Success', data.message);
        navigation.navigate('Login');
      } else if (response.status === 409) {
        Alert.alert('Error', 'Username already taken');
        navigation.navigate('Home', { error: true });
      } else if (response.status === 401) {
        Alert.alert('Error', 'Invalid OTP or Serial Number');
        navigation.navigate('Home', { error: true });
      } else {
        Alert.alert('Error', 'Something went wrong, please try again');
        navigation.navigate('Home', { error: true });
      }
    } catch (error) {
      Alert.alert('Error', 'Network error, please try again');
      navigation.navigate('Home', { error: true });
    }
  };

  return (
    <BackgroundWrapper>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            placeholder="OTP"
            value={otp}
            onChangeText={setOtp}
            style={styles.input}
          />
          <TextInput
            placeholder="Serial Number"
            value={serialNumber}
            onChangeText={setSerialNumber}
            style={styles.input}
          />
          <Button title="Get S/N-OTP" onPress={handleGetOtpSn} />
          <Button title="Submit" onPress={handleSubmit} />
        </View>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'black',
    color: 'black',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    width: '80%',
  },
});

export default SignupScreen;
