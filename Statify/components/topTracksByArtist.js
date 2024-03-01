import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import SpotifyWebApi from "spotify-web-api-node";
import { useSelector } from "react-redux";

const TopTracksByArtist = ({ artistId }) => {
  const token = useSelector((state) => state.token.token);
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    if (!token || !artistId) return;

    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);

    const fetchTopTracksByArtist = async () => {
      try {
        const response = await spotifyApi.getArtistTopTracks(
          artistId,
          "from_token"
        );
        const topTracksList = response.body.tracks.map((track) => ({
          name: track.name,
          albumImage: track.album.images[0].url,
          spotifyUrl: track.external_urls.spotify,
        }));
        setTopTracks(topTracksList);
      } catch (error) {
        console.error("Failed to fetch top tracks by artist:", error);
      }
    };

    fetchTopTracksByArtist();
  }, [token, artistId]);

  const openSpotifyLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error("Unable to open link:", url);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.ContainerTitle}>Popular Tracks by Artist</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {topTracks.map((track, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => openSpotifyLink(track.spotifyUrl)}
            style={styles.trackContainer}
          >
            <Image
              source={{ uri: track.albumImage }}
              style={styles.albumImage}
            />
            <View style={styles.trackDetails}>
              <Text style={styles.trackName} numberOfLines={1}>
                {track.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default TopTracksByArtist;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    marginTop: 20,
    marginBottom: 20,
  },
  ContainerTitle: {
    fontSize: 15,
    color: "#004921",
    marginVertical: 10,
    marginBottom: 20,
    fontWeight: "700",
  },
  trackContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginRight: 15,
    width: 100,
  },
  albumImage: {
    width: 75,
    height: 75,
    marginBottom: 5,
  },
  trackDetails: {
    alignItems: "center",
    width: 100,
  },
  trackName: {
    fontWeight: "600",
    textAlign: "center",
  },
});
