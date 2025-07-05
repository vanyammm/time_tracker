import React, {useEffect} from "react";
import {createStackNavigator, StackScreenProps} from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {View, ActivityIndicator} from "react-native";
import {StackActions} from "@react-navigation/native";

import {MainNavigation} from "./MainNavigation"; // Ваш TabNavigator
import {OnboardingNavigator} from "./OnboardingNavigator"; // Наш новий навігатор
import {COLORS} from "../theme/colors";

import {RootStackParamList} from "./types";

type ResolveAuthScreenProps = StackScreenProps<
  RootStackParamList,
  "ResolveAuth"
>;

const Stack = createStackNavigator<RootStackParamList>();

// Екран-завантажувач для перевірки стану
const ResolveAuthScreen = ({navigation}: ResolveAuthScreenProps) => {
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem("@onboarding_completed");
        // Перенаправляємо в залежності від результату
        navigation.dispatch(
          StackActions.replace(value === "true" ? "MainApp" : "OnboardingFlow"),
        );
      } catch (e) {
        // У випадку помилки краще показати онбордінг
        navigation.dispatch(StackActions.replace("OnboardingFlow"));
      }
    };

    checkOnboarding();
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.darkBlue,
      }}
    >
      <ActivityIndicator size="large" color={"white"} />
    </View>
  );
};

export const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ResolveAuth" component={ResolveAuthScreen} />
      <Stack.Screen name="OnboardingFlow" component={OnboardingNavigator} />
      <Stack.Screen name="MainApp" component={MainNavigation} />
    </Stack.Navigator>
  );
};
