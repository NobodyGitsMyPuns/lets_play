import React from 'react';
import {SafeAreaView, View, Button, Text, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import BackgroundWrapper from '../components/BackgroundWrapper';

// Adjust the path based on where your App.tsx is located

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
};

const HomeScreen: React.FC<HomeScreenProps> = ({navigation, route}) => {
  return (
    <BackgroundWrapper>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {route.params?.error && (
            <Text style={styles.errorText}>
              Failed logging in. Please try again.
            </Text>
          )}
          <Button
            title="Sign Up"
            onPress={() => navigation.navigate('Signup')}
          />
          <Button title="Login" onPress={() => navigation.navigate('Login')} />
        </View>
      </SafeAreaView>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
});

export default HomeScreen;
