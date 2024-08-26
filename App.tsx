import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View, Button, Alert } from 'react-native';

function App(): React.JSX.Element {
  const [files, setFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://192.168.1.43/files'); // Replace with your ESP32 IP address
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 255)', // White background
  },
  background: {
    backgroundColor: 'rgb(255, 255, 255)', // White background
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
