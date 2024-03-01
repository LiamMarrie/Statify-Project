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
  const token = useSelector((state) => state.token.token); // Access the Spotify API token from Redux store
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    if (!token || !artistId) return; // Ensure we have both a token and an artist ID before proceeding

    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token); // Set the access token for Spotify API requests

    const fetchArtistGenres = async () => {
      try {
        const { body } = await spotifyApi.getArtist(artistId); // Fetch artist details by ID
        setGenres(body.genres); // Update the state with the genres associated with the artist
      } catch (error) {
        console.error("Failed to fetch artist genres:", error);
      }
    };

    fetchArtistGenres();
  }, [artistId, token]); // Effect dependencies

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Genres</Text>
      <ScrollView
        style={styles.genresRow}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    color: "#004921",
    marginBottom: 10,
    fontWeight: "bold",
  },
  genresRow: {
    flexDirection: "row",
  },
  genreContainer: {
    backgroundColor: "#004921",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
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
