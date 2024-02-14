import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  Share,
  Linking,
} from "react-native";
import SpotifyWebApi from "spotify-web-api-node";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import ArtistGenres from "../../components/ArtistGenres";

const ArtistScreen = ({ route, navigation }) => {
  const { artistId } = route.params;
  const [artistDetails, setArtistDetails] = useState(null);
  const token = useSelector((state) => state.token.token);

  useEffect(() => {
    if (!token) {
      console.log("Spotify token is not available.");
      return;
    }

    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);

    const fetchArtistDetails = async () => {
      try {
        const data = await spotifyApi.getArtist(artistId);
        setArtistDetails(data.body);
      } catch (error) {
        console.error("Error fetching artist details:", error);
      }
    };

    fetchArtistDetails();
  }, [artistId, token]);

  const shareArtistProfile = async (url) => {
    try {
      await Share.share({
        message: `Check out this artist on Spotify: ${url}`,
      });
    } catch (error) {
      console.error("Error sharing artist profile:", error);
    }
  };

  const openSpotifyProfile = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error("Don't know how to open this URL:", url);
    }
  };

  if (!artistDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <StatusBar style="dark" />
          <View style={styles.mainHeader}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Icon name="chevron-left" size={20} color="#fff9f0" />
            </TouchableOpacity>
            <View style={styles.rightButtons}>
              <TouchableOpacity
                onPress={() =>
                  shareArtistProfile(artistDetails.external_urls.spotify)
                }
                style={styles.shareButton}
              >
                <Icon name="share-alt" size={20} color="#fff9f0" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  openSpotifyProfile(artistDetails.external_urls.spotify)
                }
                style={styles.spotifyButton}
              >
                <Icon name="spotify" size={20} color="#fff9f0" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.artistHeader}>
            <Image
              source={{ uri: artistDetails.images[0]?.url }}
              style={styles.artistImage}
            />
            <Text style={styles.artistName}>{artistDetails.name}</Text>
            <Text style={styles.artistListeners}>
              Followers: {artistDetails.followers.total.toLocaleString()}
            </Text>
          </View>
          <ArtistGenres artistId={artistId} />
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: "#fff9f0",
    flex: 1,
  },
  container: {
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  rightButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  backButton: {
    padding: 10,
    backgroundColor: "#004921",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  shareButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#004921",
    borderRadius: 20,
  },
  spotifyButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#004921",
    borderRadius: 20,
  },
  artistHeader: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  artistImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 10,
  },
  artistName: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    color: "#004921",
  },
  artistListeners: {
    fontSize: 15,
    color: "#666",
  },
});

export default ArtistScreen;
