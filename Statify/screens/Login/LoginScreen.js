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
          dispatch(songAction.addTopSongs(response));
        })
        .catch((error) => {
          console.error("error", error.message);
        });
      setTimeout(
        () =>
          navigation.replace("Home", {
            token: token,
            other: "blaaaa",
          }),
        500
      );
      dispatch(tokenAction.addToken(token));
    }
  });

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          color: "white",
          marginBottom: "20%",
        }}
      >
        Statify
      </Text>
      <Button
        title="Login with Spotify"
        style={styles.button}
        onPress={() => {
          promptAsync();
        }}
      />
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  button: {
    width: 200,
    marginTop: 50,
    backgroundColor: "cornflower",
  },
});
