import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import BackgroundWrapper from '../components/BackgroundWrapper';
import RNFS from 'react-native-fs';

const DEFAULT_IP = '192.168.1.43';

function UserScreen(): React.JSX.Element {
  const [espIpAddress, setEspIpAddress] = useState(DEFAULT_IP);
  const [espStatus, setEspStatus] = useState<'Reachable' | 'Unreachable'>('Unreachable');
  const [espFiles, setEspFiles] = useState<string[]>([]);
  const [selectedEspFiles, setSelectedEspFiles] = useState<string[]>([]);
  const [serverFiles, setServerFiles] = useState<string[]>([]);
  const [selectedServerFile, setSelectedServerFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const SERVER_URL = 'http://34.30.244.244/v1/list-available-midi-files';

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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const fetchServerFiles = async () => {
    try {
      const response = await fetch(SERVER_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch server files');
      }
      const files: string[] = await response.json();
      const midiFiles = files.filter(file => file.endsWith('.mid')); // Filter only .mid files
      setServerFiles(midiFiles);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        Alert.alert('Error', err.message);  // Display the error message as an alert
      } else {
        setError('An unknown error occurred');
        Alert.alert('Error', 'An unknown error occurred');  // Display a generic error message as an alert
      }
    }
  };

  const sanitizeFilename = (filename: string) => {
    // Remove any instance of /midi/ prefix
    filename = filename.replace(/^\/?midi\//, ''); // Ensures /midi/ is removed even if it starts with or without leading slash

    // Remove any extra .mid extensions
    if (filename.endsWith('.mid.mid')) {
        filename = filename.substring(0, filename.length - 4);
    }

    // Replace spaces and %20 with underscores
    filename = filename.replace(/ /g, '_').replace(/%20/g, '_');

    return filename;
};


  const downloadAndUploadFileToEsp = async () => {
    if (!selectedServerFile) {
      Alert.alert('Error', 'No file selected to download');
      return;
    }

    try {
      // Step 1: Request the signed URLs from your server
      const response = await fetch('http://34.30.244.244/v1/get-signed-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objectName: [selectedServerFile],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get signed URL');
      }

      const signedUrls = await response.json();
      const signedUrlObject = signedUrls.find((item: { objectName: string, signedUrl: string }) => item.objectName === selectedServerFile);
      const signedUrl = signedUrlObject.signedUrl;

      // Step 2: Sanitize the filename and save to a temporary directory
      const sanitizedFilename = sanitizeFilename(selectedServerFile);
      const localFileUri = `${RNFS.TemporaryDirectoryPath}/${sanitizedFilename}`;

      // Step 3: Download the file to the device's local storage
      const downloadResult = await RNFS.downloadFile({
        fromUrl: signedUrl,
        toFile: localFileUri,
      }).promise;

      if (downloadResult.statusCode !== 200) {
        throw new Error('Failed to download the file');
      }

      // Step 4: Upload the file to the ESP32
      const fileData = await RNFS.readFile(localFileUri, 'base64');

      const espUploadResponse = await fetch(`http://${espIpAddress}/upload?filename=${sanitizedFilename}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: fileData,
      });

      if (!espUploadResponse.ok) {
        throw new Error('Failed to upload file to ESP32');
      }

      Alert.alert('Success', `${signedUrlObject.objectName} downloaded and uploaded to ESP32`);

      // Step 5: Refresh the ESP32 file list after uploading
      fetchEspFiles();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        Alert.alert('Error', err.message);
      } else {
        setError('An unknown error occurred');
        Alert.alert('Error', 'An unknown error occurred');
      }
    }
  };

  const handleFileSelect = (file: string) => {
    if (selectedEspFiles.includes(file)) {
      setSelectedEspFiles(selectedEspFiles.filter(f => f !== file));
    } else {
      setSelectedEspFiles([...selectedEspFiles, file]);
    }
  };

  const handleServerFileSelect = (file: string) => {
    setSelectedServerFile(file);
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

  const truncateFilename = (filename: string, maxLength: number) => {
    if (filename.length > maxLength) {
      return filename.substring(0, maxLength) + '...';
    }
    return filename;
  };

  const handleLongPress = (filename: string) => {
    Alert.alert('Full Filename', filename);
  };

  return (
    <BackgroundWrapper>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Welcome, User!</Text>

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
                  espFiles.map((file: string, index: number) => (
                    <TouchableOpacity
                      key={index}
                      onLongPress={() => handleLongPress(file)}
                      onPress={() => handleFileSelect(file)}
                    >
                      <Text
                        style={[
                          styles.fileItem,
                          selectedEspFiles.includes(file) && styles.selectedFileItem,
                        ]}
                      >
                        {truncateFilename(file, 25)}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noFilesText}>No files found on ESP32</Text>
                )}
              </ScrollView>
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
                  serverFiles.map((file: string, index: number) => (
                    <TouchableOpacity
                      key={index}
                      onLongPress={() => handleLongPress(file)}
                      onPress={() => handleServerFileSelect(file)}
                    >
                      <Text
                        style={[
                          styles.fileItem,
                          selectedServerFile === file && styles.selectedFileItem,
                        ]}
                      >
                        {truncateFilename(file, 25)}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noFilesText}>No files found on Server</Text>
                )}
              </ScrollView>
              <Button
                title="Download and Upload to ESP32"
                onPress={downloadAndUploadFileToEsp}
                disabled={!selectedServerFile}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(38, 38, 38, 0.8)',
    borderRadius: 10,
    margin: 10,
    width: '100%',
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
});

export default UserScreen;
