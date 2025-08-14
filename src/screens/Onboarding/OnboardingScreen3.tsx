import React, {useEffect} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {common} from "../../theme/commonStyles";
import {styles} from "./styles";
import {OnBoarding} from "../../assets/lottie/OnBoarding";
import {Timer} from "../../components/Timer/Timer";
import {useOnboardingData} from "../../context/OnboardingContext";
import {
  useOnboardingActions,
  useOnboardingState,
} from "../../store/onboardingStore";
import {useTimerActions} from "../../store/timerStore";

export const OnboardingScreen3 = () => {
  const {updateRegistrationData} = useOnboardingActions();
  const {registrationData} = useOnboardingState();

  const {setDuration} = useTimerActions();

  useEffect(() => {
    if (registrationData.dailyGoalMinutes) {
      setDuration(registrationData.dailyGoalMinutes * 60);
    }
  }, []);

  const handleGoalChange = (minutes: string) => {
    const goal = parseInt(minutes, 10);
    if (!isNaN(goal)) {
      updateRegistrationData({dailyGoalMinutes: goal});
    }
  };
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
      <Timer onboarding onGoalChange={handleGoalChange} />
    </View>
  );
};
