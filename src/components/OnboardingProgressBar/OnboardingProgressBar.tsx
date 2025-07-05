import React, {useEffect} from "react";
import {View, StyleProp, ViewStyle} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import {styles} from "./styles";

interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps: number;
  style?: StyleProp<ViewStyle>;
}

export const OnboardingProgressBar = ({
  currentStep,
  totalSteps,
  style,
}: OnboardingProgressBarProps) => {
  // Починаємо з 0, бо компонент тепер один і не перестворюється
  const progress = useSharedValue(0);

  // useEffect буде плавно анімувати зміни, коли currentStep оновлюється
  useEffect(() => {
    const newProgress = totalSteps > 0 ? (currentStep + 1) / totalSteps : 0;
    progress.value = withTiming(newProgress, {duration: 300}); // Можна налаштувати тривалість
  }, [currentStep, totalSteps]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.progress, animatedStyle]} />
    </View>
  );
};
