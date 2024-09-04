import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View, Button, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  View2: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeScreen({ navigation }: { navigation: any }): React.JSX.Element {
  const [files, setFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://${default_ip}/files'); // Replace with your ESP32 IP address
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      const data = await response.text();
      const fileList = data.split('\n').filter(file => file); // Split and filter out empty lines
      setFiles(fileList);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handlePress = () => {
    Alert.alert('Button Pressed', 'Fetching files from ESP32...');
    fetchFiles(); // Fetch the files when the button is pressed
  };

  useEffect(() => {
    fetchFiles(); // Fetch the files when the component mounts
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="rgb(255, 255, 255)" />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.title}>Remote MIDI File Manager</Text>
          <Button title="Fetch Files" onPress={handlePress} />
          <Button title="Go to View 2" onPress={() => navigation.navigate('View2')} />
          {error && <Text style={styles.error}>{error}</Text>}
          {files.length > 0 ? (
            files.map((file, index) => (
              <Text key={index} style={styles.file}>
                {file}
              </Text>
            ))
          ) : (
            <Text style={styles.message}>No files found</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function View2Screen(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safeArea} >
      <View style={styles.container}>
        
        <Text style={styles.title}>Welcome to View 2</Text>
      </View>
    </SafeAreaView>
  );
}

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="View2" component={View2Screen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(10,76,110,1)', // White background
  },
  background: {
    backgroundColor: 'rgb(100,100,100)', // White background
  },
  backgroundBlue: {
    backgroundColor: "rgba(38,76,110)"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor:"rgba(38,76,110,1)",
    
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: 'rgb(32, 140, 214)', // Rockbot blue color
    marginBottom: 20,
  },
  file: {
    fontSize: 18,
    color: 'rgb(32, 140, 214)', // Rockbot blue color
    marginTop: 10,
  },
  message: {
    marginTop: 20,
    fontSize: 18,
    color: 'rgb(32, 140, 214)', // Rockbot blue color
  },
  error: {
    marginTop: 20,
    fontSize: 18,
    color: 'red',
  },
});

export default App;
