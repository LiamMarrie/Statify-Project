import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

const Loading = () => {
  const [spin, setSpin] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const spinAnimatedStyle = {
    transform: [
      {
        rotate: spin.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "360deg"],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.spinner, spinAnimatedStyle]} />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f6fa",
  },
  spinner: {
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderWidth: 4,
    width: 36,
    height: 36,
    borderRadius: 50,
    borderLeftColor: "#1DB954",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Loading;
