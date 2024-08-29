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
  const [totalSpace, setTotalSpace] = useState('');
  const [usedSpace, setUsedSpace] = useState('');
  const [serverFiles, setServerFiles] = useState<string[]>([]);  // Defined serverFiles state
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
      const lines = data.split('\n').filter(line => line);
      const fileList = lines.filter(line => !line.startsWith('Total') && !line.startsWith('Used'));

      setEspFiles(fileList);

      const totalLine = lines.find(line => line.startsWith('Total'));
      const usedLine = lines.find(line => line.startsWith('Used'));

      if (totalLine) setTotalSpace(totalLine.replace('Total LittleFS space: ', ''));
      if (usedLine) setUsedSpace(usedLine.replace('Used: ', ''));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const fetchServerFiles = async () => {
    // Placeholder for logic to fetch files from the server
    // This needs to be implemented based on your server's API
  };

  const handleFileSelect = (file: string) => {
    if (selectedEspFiles.includes(file)) {
      setSelectedEspFiles(selectedEspFiles.filter(f => f !== file));
    } else {
      setSelectedEspFiles([...selectedEspFiles, file]);
    }
  };

  const deleteSelectedFiles = () => {
    Alert.alert(
      'Delete Files',
      `Are you sure you want to delete these files: ${selectedEspFiles.join(', ')}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              for (const file of selectedEspFiles) {
                await fetch(`http://${espIpAddress}/delete?name=${encodeURIComponent(file)}`, {
                  method: 'DELETE',
                });
              }
              fetchEspFiles(); // Refresh the file list after deletion
              setSelectedEspFiles([]); // Clear selection
            } catch (err: unknown) {
              if (err instanceof Error) {
                setError(err.message);
              } else {
                setError('An unknown error occurred');
              }
            }
          },
        },
      ],
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
                    style={[styles.fileItem, selectedEspFiles.includes(file) && styles.selectedFileItem]}
                    onPress={() => handleFileSelect(file)}
                  >
                    {file}
                  </Text>
                ))
              ) : (
                <Text style={styles.noFilesText}>No files found on ESP32</Text>
              )}
            </ScrollView>
            <Text style={styles.memoryInfo}>Total Space: {totalSpace}</Text>
            <Text style={styles.memoryInfo}>Used Space: {usedSpace}</Text>
            <Button
              title="Delete Selected Files"
              onPress={deleteSelectedFiles}
              disabled={selectedEspFiles.length === 0}
            />
          </View>

          <View style={styles.submenuContainer}>
            <Text style={styles.subtitle}>Files on Server</Text>
            <Button title="Refresh Server Files" onPress={fetchServerFiles} />
            <ScrollView style={styles.fileList}>
              {serverFiles.length > 0 ? (
                serverFiles.map((file, index) => (
                  <Text key={index} style={styles.fileItem}>{file}</Text>
                ))
              ) : (
                <Text style={styles.noFilesText}>No files found on Server</Text>
              )}
            </ScrollView>
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
  },
  submenuContainer: {
    width: '100%',
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#505050',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  fileList: {
    maxHeight: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#404040',
  },
  fileItem: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  selectedFileItem: {
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
  },
  noFilesText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'gray',
    textAlign: 'center',
  },
  memoryInfo: {
    fontSize: 16,
    color: 'white',
    marginTop: 10,
  },
});

export default UserScreen;
