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

const TopAlbumsByArtist = ({ artistId }) => {
  const token = useSelector((state) => state.token.token);
  const [topAlbums, setTopAlbums] = useState([]);

  useEffect(() => {
    if (!token || !artistId) return;

    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);

    const fetchTopAlbumsByArtist = async () => {
      try {
        const response = await spotifyApi.getArtistAlbums(artistId, {
          include_groups: "album", // You can specify include_groups to 'album,single,compilation,appears_on' as needed
          limit: 20, // Adjust the limit as needed
          market: "from_token", // Use the market from the user's token
        });
        const topAlbumsList = response.body.items.map((album) => ({
          name: album.name,
          albumImage: album.images[0].url,
          spotifyUrl: album.external_urls.spotify,
        }));
        setTopAlbums(topAlbumsList);
      } catch (error) {
        console.error("Failed to fetch top albums by artist:", error);
      }
    };

    fetchTopAlbumsByArtist();
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
      <Text style={styles.ContainerTitle}>Albums by Artist</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {topAlbums.map((album, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => openSpotifyLink(album.spotifyUrl)}
            style={styles.albumContainer}
          >
            <Image
              source={{ uri: album.albumImage }}
              style={styles.albumImage}
            />
            <View style={styles.albumDetails}>
              <Text style={styles.albumName} numberOfLines={1}>
                {album.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default TopAlbumsByArtist;

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
  albumContainer: {
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
  albumDetails: {
    alignItems: "center",
    width: 100,
  },
  albumName: {
    color: "#004921",
    fontWeight: "600",
    textAlign: "center",
  },
});
