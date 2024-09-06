import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {View, StyleSheet, AppState, AppStateStatus} from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import SignupScreen from './src/screens/SignupScreen';
import LoginScreen from './src/screens/LoginScreen';
import UserScreen from './src/screens/UserScreen';
import LoadingScreen from './src/components/LoadingScreen'; // Import your custom LoadingScreen

// Define the navigation parameter list
export type RootStackParamList = {
  Home: {error?: boolean};
  Signup: undefined;
  Login: undefined;
  User: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const TimeoutSim = 2000; // 2 seconds

function App(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  useEffect(() => {
    // Show loading screen only on app startup or when returning from background
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        (appState.match(/inactive|background/) && nextAppState === 'active') ||
        (appState === 'unknown' && nextAppState === 'active')
      ) {
        // App has returned to foreground or opened initially
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
        }, TimeoutSim);
      }
      setAppState(nextAppState);
    };

    // Initial loading screen on app start
    setTimeout(() => {
      setIsLoading(false);
    }, TimeoutSim);

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [appState]);

  return (
    <NavigationContainer>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <LoadingScreen />
        </View>
      )}
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="User" component={UserScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
    zIndex: 10, // Ensure the loading screen is on top
  },
});

export default App;
