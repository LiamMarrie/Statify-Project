import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const SimilarArtists = ({ relatedArtists, navigation }) => {
  // Check if relatedArtists data is available
  if (!relatedArtists || relatedArtists.length === 0) {
    // If data is not available or empty, render a message indicating no similar artists found
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Similar Artists</Text>
        <Text>No similar artists found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Similar Artists</Text>
      <View style={styles.artistList}>
        {relatedArtists.slice(0, 12).map((artist) => (
          <TouchableOpacity
            key={artist.id}
            onPress={() =>
              navigation.navigate("Artist", { artistId: artist.id })
            }
            style={styles.artistItem}
          >
            <Image
              source={{ uri: artist.images[0]?.url }}
              style={styles.artistImage}
            />
            <Text style={styles.artistName}>{artist.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#004921",
  },
  artistList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  artistItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "33%",
    marginBottom: 10,
  },
  artistImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  artistName: {
    textAlign: "center",
    fontSize: 14,
    color: "#004921",
  },
});

export default SimilarArtists;
