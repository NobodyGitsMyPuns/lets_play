import React, {useEffect, useRef} from 'react';
import {Animated, View, StyleSheet} from 'react-native';

const EllipsisLoader: React.FC = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value) => {
      Animated.sequence([
        Animated.timing(dot, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const interval = setInterval(() => {
      animateDot(dot1);
      setTimeout(() => animateDot(dot2), 300);
      setTimeout(() => animateDot(dot3), 600);
    }, 900);

    return () => clearInterval(interval);
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.ellipsisContainer}>
      <Animated.Text style={[styles.dot, {opacity: dot1}]}>.</Animated.Text>
      <Animated.Text style={[styles.dot, {opacity: dot2}]}>.</Animated.Text>
      <Animated.Text style={[styles.dot, {opacity: dot3}]}>.</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ellipsisContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    fontSize: 40,
    color: '#000',
    marginHorizontal: 2,
  },
});

export default EllipsisLoader;
