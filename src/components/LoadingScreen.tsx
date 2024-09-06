// src/components/LoadingScreen.tsx
import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, Animated} from 'react-native';

function LoadingScreen(): React.JSX.Element {
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();
  });

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Image source={require('./Robot.jpg')} style={styles.image} />
      <View style={styles.loadingBarContainer}>
        <Animated.View style={[styles.loadingBar, {width}]} />
      </View>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Set your preferred background color
  },
  image: {
    width: 300,
    height: 550,
    marginBottom: 10,
  },
  loadingBarContainer: {
    width: '80%',
    height: 50,
    backgroundColor: 'purple', // Light grey background for the loading bar
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  loadingBar: {
    height: '100%',
    backgroundColor: 'purple', // Blue color for the loading bar
  },
  loadingText: {
    fontSize: 18,
    color: 'purple',
  },
});

export default LoadingScreen;
