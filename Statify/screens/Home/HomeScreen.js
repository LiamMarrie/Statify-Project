import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  StatusBar,
} from "react-native";
import Header from "../../components/Header";
import Genres from "../../components/Genres";
import TopSongs from "../../components/topSongs";
import TopArtists from "../../components/topArtists";
import TopAlbums from "../../components/topAlbums";
import CurrentlyPlaying from "../../components/currentlyPlaying";
import RecentlyPlayed from "../../components/recentlyListened";

const HomeScreen = ({ navigation }) => {
  const [timeRange, setTimeRange] = useState("short_term");
  const [refreshing, setRefreshing] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const handleTimeRangeChange = (newTimeRange) => {
    setTimeRange(newTimeRange);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Increment refresh counter to trigger re-fetch in CurrentlyPlaying
    setRefreshCounter((prevCounter) => prevCounter + 1);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff9f0" }}>
      <StatusBar style="dark" />
      <Header onTimeRangeChange={handleTimeRangeChange} />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <CurrentlyPlaying refreshTrigger={refreshCounter} />
        <Genres timeRange={timeRange} />
        <TopArtists timeRange={timeRange} navigation={navigation} />
        <TopSongs timeRange={timeRange} />
        <TopAlbums timeRange={timeRange} />
        <RecentlyPlayed />
        <View style={styles.bottomView}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  bottomView: {
    justifyContent: "center",
    flexDirection: "row",
    paddingBottom: 20,
  },
});
