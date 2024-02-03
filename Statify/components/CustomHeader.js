import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

const Header = (props) => {
  return (
    <View style={styles.Header}>
      <TouchableOpacity onPress={props.onSelectHome}>
        <Text>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  Header: {
    paddingHorizontal: "100%",
    paddingVertical: "20%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  Text: {
    top: 100,
    fontSize: 20,
    fontWeight: "bold",
    color: "#3a3a3a",
  },
});
