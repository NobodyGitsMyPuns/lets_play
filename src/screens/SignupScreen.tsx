import React, { useState } from 'react';
import { SafeAreaView, View, TextInput, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import BackgroundWrapper from '../components/BackgroundWrapper';

type RootStackParamList = {
  Signup: undefined;
  Home: { error?: boolean };
  User: undefined;
};

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;

type SignupScreenProps = {
  navigation: SignupScreenNavigationProp;
};

function SignupScreen({ navigation }: SignupScreenProps): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [uniqueCode, setUniqueCode] = useState('');

  const handleSubmit = () => {
    if (email === 'user@example.com' && uniqueCode === '123456') {
      navigation.navigate('User');
    } else {
      navigation.navigate('Home', { error: true });
    }
  };

  return (
    <BackgroundWrapper>
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Unique Code"
          value={uniqueCode}
          onChangeText={setUniqueCode}
          style={styles.input}
        />
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
