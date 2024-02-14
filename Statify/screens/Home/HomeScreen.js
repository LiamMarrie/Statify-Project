import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import Header from "../../components/Header";
import Genres from "../../components/Genres";
import TopSongs from "../../components/topSongs";
import TopArtists from "../../components/topArtists";
import TopAlbums from "../../components/topAlbums";
import Vibes from "../../components/vibes";

const HomeScreen = ({ navigation }) => {
  const [timeRange, setTimeRange] = useState("short_term"); // Default time range

  const handleTimeRangeChange = (newTimeRange) => {
    setTimeRange(newTimeRange);
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#fff9f0" }}>
      <ScrollView>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <StatusBar style="dark" />
          <Header onTimeRangeChange={handleTimeRangeChange} />

          {/* <Vibes timeRange={timeRange} /> */}

          <Genres timeRange={timeRange} />

          <TopArtists timeRange={timeRange} navigation={navigation} />

          <TopSongs timeRange={timeRange} />

          <TopAlbums timeRange={timeRange} />

          <View style={styles.bottomView}></View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  bottomView: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
  },
});
