import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {common} from "../../theme/commonStyles";
import {styles} from "./styles";
import {OnBoarding} from "../../assets/lottie/OnBoarding";

export const OnboardingScreen1 = () => {
  return (
    <View style={[styles.onBoardingScreen]}>
      <OnBoarding />
      <View style={[{width: 200}]}>
        <Text
          numberOfLines={2}
          style={[common.whiteText, styles.screenHeaderText]}
        >
          Welcome to Timero
        </Text>
      </View>
    </View>
  );
};
