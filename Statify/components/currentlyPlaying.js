import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import SpotifyWebApi from "spotify-web-api-node";
import { useSelector } from "react-redux";

const CurrentlyPlaying = ({ refreshTrigger }) => {
  const token = useSelector((state) => state.token.token);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    if (!token) return;

    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);

    const fetchCurrentlyPlaying = async () => {
      try {
        const response = await spotifyApi.getMyCurrentPlaybackState();
        if (response.body && response.body.is_playing) {
          setCurrentTrack({
            name: response.body.item.name,
            artist: response.body.item.artists
              .map((artist) => artist.name)
              .join(", "),
            image: response.body.item.album.images[0].url,
            spotifyUrl: response.body.item.external_urls.spotify,
          });
        } else {
          setCurrentTrack(null);
        }
      } catch (error) {
        console.error("Failed to fetch currently playing track:", error);
        setCurrentTrack(null);
      }
    };

    fetchCurrentlyPlaying();
  }, [token, refreshTrigger]); // Depend on refreshTrigger to re-fetch when it changes

  if (!currentTrack) return null; // Do not render if there's no track

  const openSpotifyLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error("Unable to open link:", url);
    }
  };

  return (
    <View style={styles.main}>
      <Text style={styles.title}>Currently Playing</Text>
      <TouchableOpacity
        style={styles.container}
        onPress={() => openSpotifyLink(currentTrack.spotifyUrl)}
      >
        <Image source={{ uri: currentTrack.image }} style={styles.albumCover} />
        <View style={styles.trackInfo}>
          <Text style={styles.trackName}>{currentTrack.name}</Text>
          <Text style={styles.artistName}>{currentTrack.artist}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CurrentlyPlaying;

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 18,
    color: "#004921",
    fontWeight: "bold",
    marginBottom: 10,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  albumCover: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    color: "#004921",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  artistName: {
    fontSize: 14,
    color: "#666",
  },
});
