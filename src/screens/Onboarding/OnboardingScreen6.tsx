import React from "react";
import {View, Text} from "react-native";
import {common} from "../../theme/commonStyles";
import {styles} from "./styles";

export const OnboardingScreen6 = () => {
  return (
    <View style={[styles.onBoardingScreen]}>
      <View style={[{width: 350}]}>
        <Text
          numberOfLines={2}
          style={[common.whiteText, styles.screenHeaderText]}
        >
          Great, lets create your first challenge!
        </Text>
      </View>
    </View>
  );
};
