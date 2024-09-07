import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import BackgroundWrapper from '../components/BackgroundWrapper';
import Config from 'react-native-config';

const midiServerUrl = Config.MIDI_SERVER_IP;
type RootStackParamList = {
  Login: undefined;
  Home: {error?: boolean};
  User: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type LoginScreenProps = {
  navigation: LoginScreenNavigationProp;
};

function LoginScreen({navigation}: LoginScreenProps): React.JSX.Element {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://${midiServerUrl}/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const responseBody = await response.json();

      if (response.status === 200) {
        Alert.alert('Success', 'Login successful');
        navigation.navigate('User');
      } else {
        Alert.alert(
          'Error',
          responseBody.message || 'Invalid username or password',
        );
        navigation.navigate('Home', {error: true});
      }
    } catch (error) {
      Alert.alert('Error', 'Network error, please try again');
      navigation.navigate('Home', {error: true});
    } finally {
      // Clear the textboxes
      setUsername('');
      setPassword('');
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
          <Button title="Login" onPress={handleLogin} />
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
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    width: '80%',
  },
});

export default LoginScreen;
