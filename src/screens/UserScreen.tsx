import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import BackgroundWrapper from '../components/BackgroundWrapper';

function UserScreen(): React.JSX.Element {
  return (
    <BackgroundWrapper>
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome, User!</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default UserScreen;
