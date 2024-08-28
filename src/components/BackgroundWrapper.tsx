import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

type BackgroundWrapperProps = {
  children: React.ReactNode;
};

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ children }) => {
  return (
    <ImageBackground
      source={require('./abstract.jpg')} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        {children}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Or 'contain' depending on your needs
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Optional overlay to make content more readable
  },
});

export default BackgroundWrapper;
