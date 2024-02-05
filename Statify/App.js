import React from "react";
import "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/Login/LoginScreen";
import HomeScreen from "./screens/Home/HomeScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import tokenReducer from "./store/reducers/token";
import songReducer from "./store/reducers/topSongs";
import { Settings } from "react-native";
import userReducer from "./store/reducers/user";
import profilePictureReducer from "./store/reducers/profilePicture";
import usernameReducer from "./store/reducers/username";

const rootReducer = combineReducers({
  token: tokenReducer,
  topSongs: songReducer,
  user: userReducer,
  profilePicture: profilePictureReducer,
  username: usernameReducer,
});

const store = createStore(rootReducer);

const Stack = createStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "transparent" },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
  backgroundColor: "yellow",
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={globalScreenOptions}>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Home"
            component={HomeScreen}
            style={{}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  headerShown: {
    display: "none",
  },
});
