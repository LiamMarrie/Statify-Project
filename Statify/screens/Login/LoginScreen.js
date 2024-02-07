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
      <View style={styles.HeroIMGContainer}>
        <Image
          source={require("../../images/heroIMG.gif")}
          style={{ width: 275, height: 275, flex: 0 }}
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
            promptAsync();
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
    top: 250,
  },
  ContentContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    top: 250,
  },
  SpotifyIcon: {
    marginRight: 15,
    color: "#fff9f0",
    fontSize: 35,
  },
});
