// screens/Login/LoginScreen.js
"use client";
"use strict";

import React, { useEffect, useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Text, View } from "react-native";
import { Button, Image } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";

import * as tokenAction from "../../store/actions/token";
import * as songAction from "../../store/actions/topSongs";

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [token, setToken] = useState("");
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: "50a70b1b6121424084026f75ed4a69bc",
      scopes: [
        "user-read-currently-playing",
        "user-read-recently-played",
        "user-read-playback-state",
        "user-top-read",
        "user-modify-playback-state",
        "streaming",
        "user-read-email",
        "user-read-private",
      ],
      usePKCE: false,
      redirectUri: "exp://127.0.0.1:8081",
      showDialog: true,
    },
    discovery
  );
  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  useEffect(() => {
    if (token) {
      axios("https://api.spotify.com/v1/me/top/tracks?time_range=short_term", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          // Ensure you're passing the data you need to the reducer, not the response object directly
          dispatch(songAction.addTopSongs(response.data.items)); // Assuming you want the items from the response
          dispatch(tokenAction.addToken(token)); // Store the token after successful data fetch
          navigation.replace("Home", { token: token }); // Navigate after actions are dispatched
        })
        .catch((error) => {
          console.error("error", error.message);
        });
    }
  }, [token, dispatch, navigation]); // Add dependencies to ensure effect runs only when necessary

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.HeroIMGContainer}>
        <Image
          source={require("../../images/herop4.gif")}
          style={{ width: 300, height: 400, borderRadius: 10 }}
        />
      </View>
      <View style={styles.ContentContainer}>
        <Text
          style={{
            fontSize: 45,
            fontWeight: "800",
            color: "#004921",
            marginTop: 20,
            marginBottom: 20,
            letterSpacing: 5,
          }}
        >
          statify
        </Text>
        <Button
          icon={<Icon name="spotify" size={25} style={styles.SpotifyIcon} />}
          title="Login with Spotify"
          buttonStyle={{
            backgroundColor: "#004921",
            borderRadius: 15,
            padding: 15,
            width: 250,
          }}
          style={styles.button}
          onPress={() => {
            promptAsync({ useProxy: true, showDialog: true });
          }}
        />
      </View>
      <View style={{ height: 500 }} />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff9f0",
  },
  HeroIMGContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: 150,
  },
  ContentContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: 180,
  },
  SpotifyIcon: {
    marginRight: 15,
    color: "#fff9f0",
    fontSize: 35,
  },
});
