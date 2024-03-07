import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import SpotifyWebApi from "spotify-web-api-node";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/actions/user";
import { setProfilePicture } from "../store/actions/profilePicture";
import { setUsername } from "../store/actions/username";

import defaultProfilePicture from "../images/defaultPFP.jpg"; // default profile picture in case of error fetching pfp

const Header = ({ onTimeRangeChange }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token.token);
  const user = useSelector((state) => state.user?.user || "Guest");
  const username = useSelector(
    (state) => state.username?.username || "username"
  );
  const profilePicture = useSelector(
    (state) => state.profilePicture?.profilePicture || defaultProfilePicture
  );

  // Fetch Spotify profile picture
  useEffect(() => {
    const fetchProfilePicture = async () => {
      const spotifyApi = new SpotifyWebApi();
      spotifyApi.setAccessToken(token);

      try {
        const profilePictureData = await spotifyApi.getMe(); // fetch user data from Spotify API
        dispatch(setProfilePicture(profilePictureData.body.images[0].url)); // set profile picture data
      } catch (error) {
        console.error("Failed to fetch profile picture:", error);
      }
    };
    if (token) {
      fetchProfilePicture();
    }
  }, [token, dispatch]);

  // Fetch Spotify display name username
  useEffect(() => {
    const fetchUserData = async () => {
      const spotifyApi = new SpotifyWebApi();
      spotifyApi.setAccessToken(token);

      try {
        const userData = await spotifyApi.getMe(); // fetch user data
        dispatch(setUsername(userData.body.id)); // dispatch action to set the unique Spotify username (id)
        dispatch(setUser(userData.body.display_name)); // set user display name
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token, dispatch]);

  // Open Spotify profile URI
  const openSpotifyProfile = async () => {
    const spotifyProfileLink = `https://open.spotify.com/user/${username}`;
    try {
      const supported = await Linking.canOpenURL(spotifyProfileLink);
      if (supported) {
        await Linking.openURL(spotifyProfileLink);
      } else {
        console.error("Unable to open link");
      }
    } catch (err) {
      console.error(`Failed to open Spotify profile: ${err}`);
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.SpotifyContentContainer}>
        <TouchableOpacity onPress={openSpotifyProfile}>
          <Text style={styles.username}>@{username}</Text>
        </TouchableOpacity>
        <Text style={styles.userInfo}>Hey, {user}!</Text>
        <Text style={styles.headingText}>
          What music have you been listening to lately
        </Text>
        <View style={styles.timeRangeButtonsContainer}>
          <TouchableOpacity
            onPress={() => onTimeRangeChange("short_term")}
            style={styles.timeRangeButton}
          >
            <Text style={styles.timeRangeButtonText}>4 weeks</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onTimeRangeChange("medium_term")}
            style={styles.timeRangeButton}
          >
            <Text style={styles.timeRangeButtonText}>6 months</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onTimeRangeChange("long_term")}
            style={styles.timeRangeButton}
          >
            <Text style={styles.timeRangeButtonText}>All time</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.SpotifyPFPContainer}>
        <Image
          style={styles.profilePicture}
          source={
            typeof profilePicture === "string"
              ? { uri: profilePicture }
              : profilePicture
          }
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 150,
    paddingTop: 30,
    paddingHorizontal: 20,
    marginBottom: 5,
    position: "relative",
  },
  SpotifyContentContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
  username: {
    fontSize: 12,
    color: "#004921",
    marginBottom: 4,
  },
  userInfo: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#004921",
  },
  headingText: {
    fontSize: 12,
    color: "#004921",
    marginTop: 5,
  },
  timeRangeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    marginHorizontal: -5,
  },
  timeRangeButton: {
    backgroundColor: "#004921",
    padding: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  timeRangeButtonText: {
    color: "#f5f6fa",
    fontSize: 10,
    fontWeight: "bold",
  },
  SpotifyPFPContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    bottom: 20,
  },
});

export default Header;
