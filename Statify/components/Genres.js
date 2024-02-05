import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, style } from "react-native";
import SpotifyWebApi from "spotify-web-api-node";
import { useSelector, useDispatch } from "react-redux";
import { setGenres } from "../store/actions/genres";

const Genres = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token.token);
  const [genres, setLocalGenres] = useState([]);

  useEffect(() => {
    if (!token) return; // Early return if token is not available

    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);

    const fetchGenres = async () => {
      try {
        const genresData = await spotifyApi.getMyTopArtists({ limit: 25 });
        const genresList = genresData.body.items
          .map((item) => item?.genres ?? []) // Use optional chaining
          .flat();
        dispatch(setGenres(genresList));
        setLocalGenres(genresList);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    };

    fetchGenres();
  }, [token, dispatch]);

  return (
    <View style={styles.Container}>
      <Text>Your top 25 artist genres are:</Text>
      <Text style={styles.genres}>Genres: {genres}</Text>
    </View>
  );
};

export default Genres;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f",
  },
  ContainerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "blue",
  },
  genres: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "blue",
  },
});
