import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { CustomNavigationBar } from "./AppBar";
import { Home } from "../screens/Home";
import { Contacts } from "../screens/Contacts";
import CityExplorerScreen from "./CityExplorerScreen";

const Stack = createStackNavigator();

export const Main: FC = () => {
  const theme = useTheme();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          header: CustomNavigationBar,
          headerStyle: {
            height: 120,
            backgroundColor: theme.colors.primary,
            flexDirection: "column",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Home" }}
        />
        <Stack.Screen
          name="Contacts"
          component={Contacts}
          options={{ title: "Contacts" }}
        />
        <Stack.Screen
          name="CityExplorer"
          component={CityExplorerScreen}
          options={{ title: "City Explorer" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Main;

