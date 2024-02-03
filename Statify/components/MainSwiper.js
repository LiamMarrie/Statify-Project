import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import Swiper from "react-native-deck-swiper";
import { useSelector } from "react-redux";

const MainSwiper = (props) => {
  const topSongs = useSelector((state) => state.topSongs.topSongs);

  // Check if topSongs.data and topSongs.data.items are defined
  if (!topSongs || !topSongs.data || !topSongs.data.items) {
    // Return a loader, placeholder, or null here
    return (
      <View style={styles.swiperContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.swiperContainer}>
      <Swiper
        cards={topSongs.data.items}
        cardIndex={props.index}
        renderCard={(card) => (
          <View style={styles.card}>
            <ImageBackground
              style={styles.imgBackground}
              resizeMode="cover"
              source={{ uri: card.album.images[0].url }}
            >
              <BlurView
                intensity={150}
                style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}
              >
                <Text style={styles.title}>{card.name}</Text>
                <Text style={styles.artist}>{card.artists[0].name}</Text>

                <Image
                  style={styles.cardImage}
                  source={{
                    uri: card.album.images[0].url,
                  }}
                />
              </BlurView>
            </ImageBackground>
          </View>
        )}
        onSwiped={props.onSwiped}
        stackSize={3}
        stackSeparation={14}
        disableTopSwipe
        infinite
        backgroundColor={"transparent"}
      />
    </View>
  );
};

export default MainSwiper;

const styles = StyleSheet.create({
  card: {
    flex: Dimensions.get("window").height < 700 ? 0.5 : 0.6,
    borderRadius: 8,
    shadowRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 0 },
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
    overflow: "hidden",
  },
  cardImage: {
    width: "70%",
    resizeMode: "contain",
    marginBottom: 10,
    flex: 1,
    marginLeft: "15%",
  },
  title: {
    marginTop: 2,
    fontSize: 24,
    marginBottom: 10,
    color: "black",
    width: "100%",
    padding: 15,
    textAlign: "center",
  },
  artist: {
    color: "black",
    textAlign: "center",
    fontSize: 22,
  },
  imgBackground: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
});
