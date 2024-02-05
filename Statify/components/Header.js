import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import SpotifyWebApi from "spotify-web-api-node";
import { useSelector, useDispatch } from "react-redux";
import { setUsername } from "../store/actions/user";
import { setProfilePicture } from "../store/actions/profilePicture";

import defaultProfilePicture from "../images/defaultPFP.jpg"; // default pfp in case of error fetching pfp

const Header = ({ title }) => {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.token.token);

  const username = useSelector((state) => state.username?.username || "Guest");

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

  //fetch spotify username
  useEffect(() => {
    const fetchUserData = async () => {
      const spotifyApi = new SpotifyWebApi();
      spotifyApi.setAccessToken(token);

      try {
        const userData = await spotifyApi.getMe(); // fetch user data from spotify api
        dispatch(setUsername(userData.body.display_name)); // set username data
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
      <Text style={styles.headerText}>{title}</Text>
      <TouchableOpacity style={styles.SpotifyContentContainer}>
        <Text style={styles.userInfo}>{username}</Text>
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
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#004921",
    letterSpacing: 5,
  },
  SpotifyContentContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin: " 0 auto ",
  },
  userInfo: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#004921",
    maxWidth: 90,
    textOverflow: "ellipsis",
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 100,
    marginLeft: 15,
  },
});

export default Header;
