import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  View,
  Image as RNImage,
} from "react-native";
import { Button } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { useAuthRequest, ResponseType } from "expo-auth-session";
import { useDispatch } from "react-redux";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";

import * as tokenAction from "../../store/actions/token";
import * as songAction from "../../store/actions/topSongs";

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const PaginationDots = ({ totalPages, currentPage }) => {
  const dotPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(dotPosition, {
      toValue: (currentPage - 1) * (styles.dot.width + styles.dot.margin * 2),
      duration: 250,
      useNativeDriver: false, // 'left' is not supported by the native animated module
    }).start();
  }, [currentPage]);

  return (
    <View style={styles.paginationContainer}>
      {Array.from({ length: totalPages }, (_, index) => (
        <View key={index} style={styles.dot} />
      ))}
      <Animated.View
        style={[
          styles.dot,
          styles.activeDot,
          {
            position: "absolute",
            left: dotPosition,
          },
        ]}
      />
    </View>
  );
};

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [token, setToken] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;
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

  const pageAnimation = useRef(new Animated.Value(0)).current; // For animating the opacity

  // Animation transition
  const transitionToPage = (pageNumber) => {
    Animated.timing(pageAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setCurrentPage(pageNumber);
      pageAnimation.setValue(0);
    });
  };

  useEffect(() => {
    Animated.timing(pageAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentPage]);

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
          dispatch(songAction.addTopSongs(response.data.items));
          dispatch(tokenAction.addToken(token));
          navigation.replace("Home", { token: token });
        })
        .catch((error) => {
          console.error("error", error.message);
        });
    }
  }, [token, dispatch, navigation]);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Animated.View
        style={[
          styles.pageContainer,
          {
            opacity: pageAnimation,
            transform: [
              {
                scale: pageAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.96, 1],
                }),
              },
            ],
          },
        ]}
      >
        {currentPage === 1 && (
          <View style={styles.content}>
            <RNImage
              source={require("../../images/Playlist-bro.png")}
              style={styles.pageImage}
            />
            <Text style={styles.pageText}>Track your listening habits</Text>
          </View>
        )}
        {currentPage === 2 && (
          <View style={styles.content}>
            <RNImage
              source={require("../../images/Playing-Music-bro.png")}
              style={styles.pageImage}
            />
            <Text style={styles.pageText}>Find the music you love</Text>
          </View>
        )}
        {currentPage === 3 && (
          <View style={styles.content}>
            <RNImage
              source={require("../../images/Listening-happy-music-bro.png")}
              style={styles.pageImage}
            />
            <Text style={styles.pageText}>Statify</Text>
            <Button
              icon={
                <Icon
                  name="spotify"
                  size={24}
                  color="white"
                  style={{ marginRight: 10 }}
                />
              }
              title="Login with Spotify"
              buttonStyle={styles.loginButton}
              onPress={() => promptAsync({ useProxy: true })}
            />
          </View>
        )}
      </Animated.View>
      <View style={styles.bottomContainer}>
        <PaginationDots totalPages={totalPages} currentPage={currentPage} />
        {currentPage < totalPages && (
          <Button
            icon={<Icon name="arrow-right" size={24} color="white" />}
            onPress={() => transitionToPage(currentPage + 1)}
            buttonStyle={styles.nextButton}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#fff9f0",
  },
  pageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  pageText: {
    maxWidth: 250,
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
    bottom: 35,
    color: "#004921",
  },
  pageImage: {
    width: 300,
    height: 400,
    resizeMode: "contain",
  },
  loginButton: {
    backgroundColor: "#004921",
    borderRadius: 20,
    padding: 15,
  },
  nextButton: {
    backgroundColor: "#004921",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: "100%",
    bottom: 20,
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "grey",
    margin: 5,
  },
  activeDot: {
    backgroundColor: "#004921",
  },
});

export default LoginScreen;
