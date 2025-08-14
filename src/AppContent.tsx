import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {RootNavigator} from "./navigation/RootNavigator";

export const AppContent = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};
