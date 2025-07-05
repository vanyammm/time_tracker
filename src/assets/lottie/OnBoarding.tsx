import React from "react";
import {View} from "react-native";
import LottieView from "lottie-react-native";

export const OnBoarding = () => {
  return (
    <LottieView
      source={require("./onboarding.json")}
      autoPlay
      loop
      style={{width: 200, height: 200}}
    />
  );
};
