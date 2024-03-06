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

const TopAlbums = ({ timeRange }) => {
  // Include timeRange prop
  const [topAlbums, setTopAlbums] = useState([]);
  const token = useSelector((state) => state.token.token);

  useEffect(() => {
    if (!token) return;

    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);

    const fetchTopAlbums = async () => {
      try {
        const data = await spotifyApi.getMyTopTracks({
          limit: 50, // Adjust based on the API limit
          time_range: timeRange,
        });

        // Initialize an object to hold album data and a weighted count
        const albumCounts = {};

        data.body.items.forEach((track, index) => {
          const albumId = track.album.id;
          if (!albumCounts[albumId]) {
            albumCounts[albumId] = {
              ...track.album,
              trackCount: 1,
              weightedCount: 0, // Initialize weighted count
              artists: track.album.artists
                .map((artist) => artist.name)
                .join(", "),
            };
          } else {
            albumCounts[albumId].trackCount += 1;
          }
          // Weight the count inversely to its index position; lower index means higher preference
          albumCounts[albumId].weightedCount += 50 - index;
        });

        // Sort albums by weighted count
        const albumsSorted = Object.values(albumCounts).sort(
          (a, b) => b.weightedCount - a.weightedCount
        );

        setTopAlbums(albumsSorted);
      } catch (error) {
        console.error("Error fetching top albums:", error);
      }
    };

    fetchTopAlbums();
  }, [token, timeRange]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Albums</Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.albumsContainer}
      >
        {topAlbums.map((album, index) => (
          <TouchableOpacity
            key={index}
            style={styles.albumContainer}
            onPress={() => Linking.openURL(album.external_urls.spotify)}
            accessibilityLabel={`Open ${album.name}'s Spotify profile`}
            accessibilityRole="button"
          >
            <Image
              source={{ uri: album.images[0]?.url }}
              style={styles.albumImage}
            />
            <Text style={styles.albumName} numberOfLines={1}>
              {album.name}
            </Text>
            <Text style={styles.artistName} numberOfLines={1}>
              {album.artists}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default TopAlbums;

const styles = StyleSheet.create({
  container: {
    flex: 0,
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#004921",
  },
  albumsContainer: {
    flexDirection: "row",
  },
  albumContainer: {
    marginRight: 15,
    alignItems: "center",
    width: 100,
  },
  albumImage: {
    width: 70,
    height: 70,
    marginBottom: 5,
  },
  albumName: {
    color: "#004921",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
  artistName: {
    color: "#666",
  },
});
