import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
import { StyleSheet, View, Text, KeyboardAvoidingView } from "react-native";
//import CountDown from "../../components/CountDown";
import Header from "../../components/Header";
import Genres from "../../components/Genres";
import TopSongs from "../../components/topSongs";

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView>
        <StatusBar style="dark" />
        <Header />

        <Genres />

        <TopSongs />

        {/*<CountDown />*/}

        <View
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
            marginTop: "2%",
          }}
        ></View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f6fa",
  },
});
