import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import SpotifyWebApi from "spotify-web-api-node";
import { useSelector } from "react-redux";

const ArtistGenres = ({ artistId }) => {
  const token = useSelector((state) => state.token.token);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    if (!token || !artistId) return;

    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);

    const fetchArtistGenres = async () => {
      try {
        const { body } = await spotifyApi.getArtist(artistId);
        setGenres(body.genres);
      } catch (error) {
        console.error("Failed to fetch artist genres:", error);
      }
    };

    fetchArtistGenres();
  }, [artistId, token]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Genres</Text>
      <ScrollView style={styles.genresRow}>
        {genres.length ? (
          genres.map((genre, index) => (
            <TouchableOpacity key={index} style={styles.genreContainer}>
              <Text style={styles.genre}>{genre}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noGenres}>No genres found</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    marginLeft: 20,
  },
  title: {
    fontSize: 18,
    color: "#004921",
    marginBottom: 10,
    fontWeight: "bold",
    alignSelf: "left", // Center title if the container flex direction is column
  },
  genresRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%", // Full width to accommodate flex wrapping
    flexWrap: "wrap", // Add this line to wrap the children
  },
  genreContainer: {
    backgroundColor: "#004921",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    margin: 5, // Add margin around each genre for spacing
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  genre: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f5f6fa",
  },
  noGenres: {
    fontSize: 14,
    color: "#666",
  },
});

export default ArtistGenres;
