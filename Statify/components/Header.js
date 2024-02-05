import React, { useEffect } from "react";
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

import defaultProfilePicture from "../images/defaultPFP.jpg"; // default pfp in case of error fetching pfp

const Header = ({ title }) => {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.token.token);

  const user = useSelector((state) => state.user?.user || "Guest");

  const username = useSelector(
    (state) => state.username?.username || "username"
  );

  const profilePicture = useSelector(
    (state) => state.profilePicture?.profilePicture || defaultProfilePicture
  );

  //fetch spotify profile picture
  useEffect(() => {
    const fetchProfilePicture = async () => {
      const spotifyApi = new SpotifyWebApi();
      spotifyApi.setAccessToken(token);

      try {
        const profilePictureData = await spotifyApi.getMe(); // fetch user data from spotify api
        dispatch(setProfilePicture(profilePictureData.body.images[0].url)); // set profile picture data
      } catch (error) {
        console.error("Failed to fetch profile picture:", error);
      }
    };
    if (token) {
      fetchProfilePicture();
    }
  }, [token, dispatch]);

  //fetch spotify display name username
  useEffect(() => {
    const fetchUserData = async () => {
      const spotifyApi = new SpotifyWebApi();
      spotifyApi.setAccessToken(token);

      try {
        const userData = await spotifyApi.getMe(); // fetch user data
        dispatch(setUsername(userData.body.id)); // dispatch action to set the unique Spotify username (id)
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token, dispatch]);

  // open spotify profile uri
  const openSpotifyProfile = async () => {
    const spotifyProfileLink = `https://open.spotify.com/user/${username}`; // open spotify profile on spotify app
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

  //fetch spotify user name
  useEffect(() => {
    const fetchUserData = async () => {
      const spotifyApi = new SpotifyWebApi();
      spotifyApi.setAccessToken(token);

      try {
        const userData = await spotifyApi.getMe(); // fetch user data from spotify api
        dispatch(setUser(userData.body.display_name)); // set user name data
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token, dispatch]);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.SpotifyContentContainer}>
        <TouchableOpacity onPress={openSpotifyProfile}>
          <Text style={styles.username}>@{username}</Text>
        </TouchableOpacity>
        <Text style={styles.userInfo}>Hey, {user}!</Text>
        <Text style={styles.headingText}>
          What have you been listening to recently?
        </Text>
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
    height: 100,
    paddingTop: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
    position: "relative",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#004921",
    letterSpacing: 5,
  },
  SpotifyContentContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "left",
    margin: " 0 auto ",
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
    maxWidth: "250px",
  },
  headingText: {
    fontSize: 12,
    color: "#004921",
    maxWidth: "200px",
    marginTop: 5,
  },
  SpotifyPFPContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin: " 0 auto ",
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 100,
    marginLeft: 15,
  },
});

export default Header;
