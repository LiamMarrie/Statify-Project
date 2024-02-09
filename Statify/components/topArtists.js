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

const TopArtists = ({ timeRange }) => {
  // Include timeRange prop
  const [topArtists, setTopArtists] = useState([]);
  const token = useSelector((state) => state.token.token);

  useEffect(() => {
    if (!token) return;

    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);

    const fetchTopArtists = async () => {
      try {
        const data = await spotifyApi.getMyTopArtists({
          limit: 25,
          time_range: timeRange, // Use the timeRange prop
        });
        setTopArtists(data.body.items);
      } catch (error) {
        console.error("Error fetching top artists:", error);
      }
    };

    fetchTopArtists();
  }, [token, timeRange]); // Correct the dependency array to use `timeRange`

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Artists</Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.artistsContainer}
      >
        {topArtists.map((artist, index) => (
          <TouchableOpacity
            key={index}
            style={styles.artistContainer}
            onPress={() => Linking.openURL(artist.external_urls.spotify)}
          >
            <Image
              source={{ uri: artist.images[0]?.url }}
              style={styles.artistImage}
            />
            <Text style={styles.artistName} numberOfLines={1}>
              {artist.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    marginTop: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#004921",
  },
  artistsContainer: {
    flexDirection: "row",
  },
  artistContainer: {
    marginRight: 15,
    alignItems: "center",
    width: 100,
  },
  artistImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginBottom: 5,
  },
  artistName: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
});

export default TopArtists;
