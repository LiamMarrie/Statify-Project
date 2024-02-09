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

// Include the `timeRange` prop here
const TopSongs = ({ timeRange }) => {
  const token = useSelector((state) => state.token.token);
  const [topSongs, setTopSongs] = useState([]);

  useEffect(() => {
    if (!token) return;

    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);

    const fetchTopSongs = async () => {
      try {
        const topSongsData = await spotifyApi.getMyTopTracks({
          limit: 25,
          time_range: timeRange, // Use the `timeRange` prop
        });
        const topSongsList = topSongsData.body.items.map((item) => ({
          name: item.name,
          artist: item.artists.map((artist) => artist.name).join(", "),
          albumImage: item.album.images[0].url,
          spotifyUrl: item.external_urls.spotify,
        }));
        setTopSongs(topSongsList);
      } catch (error) {
        console.error("Failed to fetch top songs:", error);
      }
    };

    fetchTopSongs();
  }, [token, timeRange]); // Correct the dependency array to use `timeRange`

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
      <Text style={styles.ContainerTitle}>Top Tracks</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {topSongs.map((song, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => openSpotifyLink(song.spotifyUrl)}
            style={styles.songContainer}
          >
            <Image
              source={{ uri: song.albumImage }}
              style={styles.albumImage}
            />
            <View style={styles.songDetails}>
              <Text style={styles.songName} numberOfLines={1}>
                {song.name}
              </Text>
              <Text style={styles.artistName} numberOfLines={1}>
                {song.artist}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default TopSongs;

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
  songContainer: {
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
  songDetails: {
    alignItems: "center",
    width: 100,
  },
  songName: {
    fontWeight: "600",
    textAlign: "center",
  },
  artistName: {
    textAlign: "center",
  },
});
