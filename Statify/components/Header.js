import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import SpotifyWebApi from "spotify-web-api-node";
import { useSelector, useDispatch } from "react-redux";
import { setUsername } from "../store/actions/user";

const Header = ({ title }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token.token);
  const username = useSelector((state) => state.username?.username || "Guest");

  useEffect(() => {
    const fetchUserData = async () => {
      const spotifyApi = new SpotifyWebApi();
      spotifyApi.setAccessToken(token);

      try {
        const userData = await spotifyApi.getMe(); // Fetch user data
        dispatch(setUsername(userData.body.display_name)); // Dispatch action to set username
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
      <TouchableOpacity>
        <Text style={styles.userInfo}>{username}</Text>
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
    marginTop: 35,
    height: 100,
    paddingTop: 36,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#004921",
    letterSpacing: 5,
  },
  userInfo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#004921",
  },
});

export default Header;
