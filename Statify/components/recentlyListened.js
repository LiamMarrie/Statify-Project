import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import SpotifyWebApi from "spotify-web-api-node";
import { useSelector } from "react-redux";
import { Linking } from "react-native";

const RecentlyPlayed = () => {
  const token = useSelector((state) => state.token.token);
  const [recentTracks, setRecentTracks] = useState([]);

  useEffect(() => {
    if (!token) return;

    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);

    const fetchRecentlyPlayed = async () => {
      try {
        const response = await spotifyApi.getMyRecentlyPlayedTracks({
          limit: 50,
        });
        setRecentTracks(response.body.items);
      } catch (error) {
        console.error("Error fetching recently played tracks:", error);
      }
    };

    fetchRecentlyPlayed();
  }, [token]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.songContainer}
      onPress={() => openInSpotify(item.track.external_urls.spotify)}
    >
      <Image
        source={{ uri: item.track.album.images[0].url }}
        style={styles.albumImage}
      />
      <View style={styles.songDetails}>
        <Text style={styles.songName}>{item.track.name}</Text>
        <Text style={styles.artistName}>
          {item.track.artists.map((artist) => artist.name).join(", ")}
        </Text>
        <Text style={styles.playedAt}>{getPlayedTime(item.played_at)}</Text>
      </View>
    </TouchableOpacity>
  );

  const openInSpotify = (spotifyUrl) => {
    Linking.openURL(spotifyUrl);
  };

  const getPlayedTime = (playedAt) => {
    const playedDate = new Date(playedAt);
    const currentTime = new Date();
    const timeDifference = currentTime - playedDate;
    const hours = Math.floor(timeDifference / (1000 * 60 * 60)); // Convert milliseconds to hours
    return `${hours} hours ago`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.containerTitle}>Recently Played</Text>
      <FlatList
        data={recentTracks}
        renderItem={renderItem}
        keyExtractor={(item) => item.played_at}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    marginTop: 20,
    marginBottom: 20,
  },
  containerTitle: {
    fontSize: 15,
    color: "#004921",
    marginVertical: 10,
    marginBottom: 20,
    fontWeight: "700",
  },
  songContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  albumImage: {
    width: 75,
    height: 75,
    marginRight: 10,
  },
  songDetails: {
    flex: 1,
  },
  songName: {
    color: "#004921",
    fontWeight: "600",
    textAlign: "left",
  },
  artistName: {
    color: "#666",
    textAlign: "left",
  },
  playedAt: {
    color: "#666",
    textAlign: "left",
    fontSize: 12,
    marginTop: 3,
  },
});

export default RecentlyPlayed;
