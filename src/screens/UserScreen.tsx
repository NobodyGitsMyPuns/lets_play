import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import BackgroundWrapper from '../components/BackgroundWrapper';

const DEFAULT_IP = '192.168.1.43';
const PING_INTERVAL = 5000; // 5 seconds

function UserScreen(): React.JSX.Element {
  const [espIpAddress, setEspIpAddress] = useState(DEFAULT_IP);
  const [espStatus, setEspStatus] = useState<'Reachable' | 'Unreachable'>('Unreachable');
  const [espFiles, setEspFiles] = useState<string[]>([]);
  const [selectedEspFiles, setSelectedEspFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(checkEspIp, PING_INTERVAL);
    return () => clearInterval(interval); // Clear the interval on component unmount
  }, [espIpAddress]);

  const checkEspIp = async () => {
    try {
      const response = await fetch(`http://${espIpAddress}/check-ip`);
      if (response.ok) {
        setEspStatus('Reachable');
      } else {
        setEspStatus('Unreachable');
      }
    } catch (error) {
      setEspStatus('Unreachable');
    }
  };

  const fetchEspFiles = async () => {
    try {
      const response = await fetch(`http://${espIpAddress}/files`);
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      const data = await response.text();
      const fileList = data.split('\n').filter(file => file); // Split and filter out empty lines
      setEspFiles(fileList);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const toggleFileSelection = (fileName: string) => {
    setSelectedEspFiles(prevSelected => {
      if (prevSelected.includes(fileName)) {
        return prevSelected.filter(file => file !== fileName);
      } else {
        return [...prevSelected, fileName];
      }
    });
  };

  const deleteSelectedFiles = () => {
    Alert.alert(
      "Delete Files",
      `Are you sure you want to delete the selected files: ${selectedEspFiles.join(', ')}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            for (const file of selectedEspFiles) {
              try {
                const response = await fetch(`http://${espIpAddress}/delete`, {
                  method: 'DELETE',
                  body: new URLSearchParams({ name: file })
                });
                if (!response.ok) {
                  throw new Error(`Failed to delete ${file}`);
                }
              } catch (err) {
                Alert.alert('Error', `Failed to delete ${file}`);
              }
            }
            // Refresh file list after deletion
            fetchEspFiles();
          }
        }
      ]
    );
  };

  return (
    <BackgroundWrapper>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome, User!</Text>

          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: espStatus === 'Reachable' ? 'green' : 'red' }]}>
              {`ESP32 Status: ${espStatus}`}
            </Text>
            <Button title="Check IP" onPress={checkEspIp} />
          </View>

          <TextInput
            placeholder="Enter ESP32 IP Address"
            placeholderTextColor="gray"
            value={espIpAddress}
            onChangeText={setEspIpAddress}
            style={styles.input}
          />

          <View style={styles.submenuContainer}>
            <Text style={styles.subtitle}>Files on ESP32</Text>
            <Button title="Refresh ESP Files" onPress={fetchEspFiles} />
            <ScrollView style={styles.fileList}>
              {espFiles.length > 0 ? (
                espFiles.map((file, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.fileItem,
                      selectedEspFiles.includes(file) && styles.selectedFileItem
                    ]}
                    onPress={() => toggleFileSelection(file)}
                  >
                    {file}
                  </Text>
                ))
              ) : (
                <Text style={styles.noFilesText}>No files found on ESP32</Text>
              )}
            </ScrollView>
            <Button title="Delete Selected Files" onPress={deleteSelectedFiles} />
          </View>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(38, 38, 38, 0.8)',
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#505050',
    padding: 15,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 15,
    width: '100%',
    color: 'white',
    borderRadius: 10,
    backgroundColor: '#303030',
