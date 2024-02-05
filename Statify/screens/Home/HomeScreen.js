import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
import { StyleSheet, View, Text } from "react-native";
import CountDown from "../../components/CountDown";
import Header from "../../components/Header";

/*
import Player from "../../components/Player";
import MainSwiper from "../../components/MainSwiper";
*/

const HomeScreen = ({ navigation }) => {
  /*
  const [index, setIndex] = useState(0);

  console.log(`index: ${index}`);
  const onSwiped = () => {
    if (index === 19) {
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
    console.log(`index: ${index}`);
  };
  */
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <StatusBar style="dark" />
        <Header title="statify" />

        <CountDown />

        <View
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
            marginTop: "2%",
          }}
        ></View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
});
