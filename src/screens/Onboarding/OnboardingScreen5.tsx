import React from "react";
import {View, Text} from "react-native";
import {common} from "../../theme/commonStyles";
import {styles} from "./styles";

export const OnboardingScreen5 = () => {
  return (
    <View style={[styles.onBoardingScreen]}>
      <View style={[{width: 350}]}>
        <Text
          numberOfLines={2}
          style={[
            common.whiteText,
            styles.screenHeaderText,
            {marginBottom: 13},
          ]}
        >
          Get notifications
        </Text>
        <Text style={[styles.screenMainText]}>
          We`ll remind you about sessions , challenges & everything important!
        </Text>
      </View>
    </View>
  );
};
