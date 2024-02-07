import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import SpotifyWebApi from "spotify-web-api-node";
import { useSelector, useDispatch } from "react-redux";
import { setGenres } from "../store/actions/genres";

const Genres = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token.token);
  const [genres, setLocalGenres] = useState([]);

  useEffect(() => {
    if (!token) return;

    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);

    const fetchGenres = async () => {
      try {
        const genresData = await spotifyApi.getMyTopArtists({ limit: 10 });
        const uniqueGenres = new Set(
          genresData.body.items.flatMap((item) => item?.genres ?? [])
        );
        // Convert the Set back to an array
        const genresList = Array.from(uniqueGenres);
        dispatch(setGenres(genresList));
        setLocalGenres(genresList);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    };

    fetchGenres();
  }, [token, dispatch]);

  return (
    <View style={styles.container}>
      <Text style={styles.ContainerTitle}>
        Genres you've been listening to a lot recently
      </Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.genresContainer}
      >
        {genres.map((genre, index) => (
          <View key={index} style={styles.genreContainer}>
            <Text style={styles.genre}>{genre}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Genres;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingTop: 20,
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
