import React, {useEffect} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {common} from "../../theme/commonStyles";
import {styles} from "./styles";
import {OnBoarding} from "../../assets/lottie/OnBoarding";
import {Timer} from "../../components/Timer/Timer";
import {useOnboardingData} from "../../context/OnboardingContext";

export const OnboardingScreen3 = () => {
  // const {dailyGoalMinutes} = useOnboardingData();

  // useEffect(() => {
  //   console.log("daily goal minutes:", dailyGoalMinutes);
  // }, [dailyGoalMinutes]);

  return (
    <View style={[styles.onBoardingScreen]}>
      <View style={[{width: 300}]}>
        <Text
          numberOfLines={2}
          style={[common.whiteText, styles.screenHeaderText]}
        >
          What is your daily focus goal?
        </Text>
      </View>
      <Timer onboarding />
    </View>
  );
};
