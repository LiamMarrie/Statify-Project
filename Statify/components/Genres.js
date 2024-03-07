import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import SpotifyWebApi from "spotify-web-api-node";
import { useSelector, useDispatch } from "react-redux";
import { setGenres } from "../store/actions/genres";

const Genres = ({ timeRange }) => {
  // Include timeRange prop
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token.token);
  const [genres, setLocalGenres] = useState([]);

  useEffect(() => {
    if (!token) return;

    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);

    const fetchGenres = async () => {
      try {
        const genresData = await spotifyApi.getMyTopArtists({
          limit: 10,
          time_range: timeRange, // Use the timeRange prop
        });
        const uniqueGenres = new Set(
          genresData.body.items.flatMap((item) => item?.genres ?? [])
        );
        const genresList = Array.from(uniqueGenres);
        dispatch(setGenres(genresList));
        setLocalGenres(genresList);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    };

    fetchGenres();
  }, [token, dispatch, timeRange]);

  const openGenreInSpotify = async (genre) => {
    const encodedGenre = encodeURIComponent(`${genre} mix`);
    const url = `spotify:search:${encodedGenre}`;
    const webUrl = `https://open.spotify.com/search/${encodedGenre}`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(webUrl); // Fallback to web if the app can't open the URL
      }
    } catch (error) {
      console.error("Couldn't open Spotify:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.ContainerTitle}>Genres you've been listening to</Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.genresContainer}
      >
        {genres.map((genre, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => openGenreInSpotify(genre)}
            style={styles.genreContainer}
          >
            <Text style={styles.genre}>{genre}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Genres;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    width: "100%",
  },
  ContainerTitle: {
    fontSize: 15,
    color: "#004921",
    marginBottom: 10,
    fontWeight: "700",
  },
  genresContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  genreContainer: {
    marginRight: 20,
    backgroundColor: "#004921",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  genre: {
    fontSize: 16,
    color: "#f5f6fa",
    fontWeight: "bold",
  },
});
