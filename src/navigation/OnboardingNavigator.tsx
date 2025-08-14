import React, {useEffect, useState} from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import {StackActions} from "@react-navigation/native";
import {View, SafeAreaView, StyleSheet} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {OnboardingProgressBar} from "../components/OnboardingProgressBar/OnboardingProgressBar";
import {UIButton} from "../components/UIButton/UIButton";
import {COLORS} from "../theme/colors";

import type {RootStackParamList, OnboardingButtonConfig} from "./types";
import type {StackScreenProps} from "@react-navigation/stack";
import {styles} from "./styles";
import {OnboardingScreen1} from "../screens/Onboarding/OnboardingScreen1";
import {OnboardingScreen2} from "../screens/Onboarding/OnboardingScreen2";
import {OnboardingScreen3} from "../screens/Onboarding/OnboardingScreen3";
import {OnboardingScreen4} from "../screens/Onboarding/OnboardingScreen4";
import {OnboardingScreen5} from "../screens/Onboarding/OnboardingScreen5";
import {OnboardingScreen6} from "../screens/Onboarding/OnboardingScreen6";
import {OnboardingScreen7} from "../screens/Onboarding/OnboardingScreen7";
import {
  useOnboardingActions,
  useOnboardingState,
} from "../store/onboardingStore";
import {useUserStore} from "../store/userStore";

const onboardingScreens = [
  {
    name: "Onboarding1",
    component: OnboardingScreen1,
    buttons: {showNext: true, nextText: "Next", showSkip: false},
  },
  {
    name: "Onboarding2",
    component: OnboardingScreen2,
    buttons: {showNext: true, nextText: "Next", showSkip: false},
  },
  {
    name: "Onboarding3",
    component: OnboardingScreen3,
    buttons: {showNext: true, nextText: "Next", showSkip: false},
  },
  {
    name: "Onboarding4",
    component: OnboardingScreen4,
    buttons: {showNext: true, nextText: "Next", showSkip: false},
  },
  {
    name: "Onboarding5",
    component: OnboardingScreen5,
    buttons: {showNext: true, nextText: "Next", showSkip: true},
  },
  {
    name: "Onboarding6",
    component: OnboardingScreen6,
    buttons: {showNext: true, nextText: "Next", showSkip: false},
  },
  {
    name: "Onboarding7",
    component: OnboardingScreen7,
    buttons: {showNext: true, nextText: "Next", showSkip: false},
  },
] as const;

type ScreenNames = (typeof onboardingScreens)[number]["name"];
export type OnboardingStackParamList = Record<ScreenNames, undefined>;

const Stack = createStackNavigator<OnboardingStackParamList>();

type OnboardingNavigatorProps = StackScreenProps<
  RootStackParamList,
  "OnboardingFlow"
>;

interface FooterProps {
  currentStep: number;
  buttonConfig: OnboardingButtonConfig;
  onNext: () => void;
  onSkip: () => void;
}

const OnboardingFooter: React.FC<FooterProps> = ({
  currentStep,
  buttonConfig,
  onNext,
  onSkip,
}) => {
  const {isNextStepAllowed} = useOnboardingState();

  return (
    <View style={styles.footer}>
      <OnboardingProgressBar
        currentStep={currentStep}
        totalSteps={onboardingScreens.length}
      />
      <View style={styles.buttonsContainer}>
        {buttonConfig.showSkip ? (
          <UIButton
            onPress={onSkip}
            bgColor="transparent"
            color={COLORS.lightGray}
          >
            Пропустити
          </UIButton>
        ) : (
          <View style={{width: 90}} />
        )}
        {buttonConfig.showNext && (
          <UIButton
            onPress={onNext}
            style={[styles.nextButton]}
            disabled={!isNextStepAllowed}
          >
            {buttonConfig.nextText}
          </UIButton>
        )}
      </View>
    </View>
  );
};

export const OnboardingNavigator = ({
  navigation: rootNavigation,
}: OnboardingNavigatorProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const {reset: resetOnboardingState} = useOnboardingActions();
  const {logout: logoutUser} = useUserStore();

  useEffect(() => {
    resetOnboardingState();
    logoutUser();
    return () => {
      resetOnboardingState();
    };
  }, [resetOnboardingState]);

  const buttonConfig = onboardingScreens[currentStep].buttons;

  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem("@onboarding_completed", "true");
      rootNavigation.dispatch(StackActions.replace("MainApp"));
    } catch (e) {
      console.error("Failed to save onboarding status", e);
    }
  };

  const handleNext = () => {
    const nextStep = currentStep + 1;
    if (nextStep < onboardingScreens.length) {
      const nextScreenName = onboardingScreens[nextStep].name;
      rootNavigation.navigate("OnboardingFlow", {screen: nextScreenName});
    } else {
      finishOnboarding();
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator
        initialRouteName="Onboarding1"
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        }}
        screenListeners={{
          focus: (e) => {
            const currentRouteName = e.target?.split("-")[0];
            const newIndex = onboardingScreens.findIndex(
              (screen) => screen.name === currentRouteName,
            );
            if (newIndex !== -1 && newIndex !== currentStep) {
              setCurrentStep(newIndex);
            }
          },
        }}
      >
        {onboardingScreens.map((screenConfig) => (
          <Stack.Screen
            key={screenConfig.name}
            name={screenConfig.name as keyof OnboardingStackParamList}
            component={screenConfig.component}
          />
        ))}
      </Stack.Navigator>
      <OnboardingFooter
        currentStep={currentStep}
        buttonConfig={buttonConfig}
        onNext={handleNext}
        onSkip={handleSkip}
      />
    </SafeAreaView>
  );
};
