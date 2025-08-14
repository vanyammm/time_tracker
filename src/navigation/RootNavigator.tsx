import React, {useEffect} from "react";
import {createStackNavigator, StackScreenProps} from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {View, ActivityIndicator} from "react-native";
import {StackActions} from "@react-navigation/native";

import {MainNavigation} from "./MainNavigation";
import {OnboardingNavigator} from "./OnboardingNavigator";
import {COLORS} from "../theme/colors";

import {ChallengeDetailsScreen} from "../screens/ChallengeDetailsScreen/ChallengeDetailsScreen";
import {ChallengeResultScreen} from "../screens/ChallengeResultScreen/ChallengeResultScreen";

import {RootStackParamList} from "./types";
import {ChallengeAcrhiveScreen} from "../screens/ChallengeArchiveScreen/ChallengeArchiveScreen";
import {ChallengeCreationNavigator} from "./ChallengeCreationNavigator";
import {SettingsNavigator} from "./SettingsNavigator";
import {AuthModalScreen} from "../screens/AuthModalScreen/AuthModalScreen";

type ResolveAuthScreenProps = StackScreenProps<
  RootStackParamList,
  "ResolveAuth"
>;

const Stack = createStackNavigator<RootStackParamList>();

const ResolveAuthScreen = ({navigation}: ResolveAuthScreenProps) => {
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem("@onboarding_completed");
        navigation.dispatch(
          StackActions.replace(value === "true" ? "MainApp" : "OnboardingFlow"),
        );
      } catch (e) {
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

      <Stack.Screen name="ChallengeResult" component={ChallengeResultScreen} />
      <Stack.Screen
        name="ChallengeDetails"
        component={ChallengeDetailsScreen}
      />
      <Stack.Screen
        name="ChallengeArchive"
        component={ChallengeAcrhiveScreen}
        options={{
          headerShown: true,
          title: "Past Challenges",
          headerTintColor: "white",
          headerStyle: {
            backgroundColor: COLORS.darkBlue,
          },
          headerBackTitle: "Back",
        }}
      />

      <Stack.Screen
        name="ChallengeCreation"
        component={ChallengeCreationNavigator}
        options={{
          presentation: "modal",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen name="Settings" component={SettingsNavigator} />
      <Stack.Screen
        name="Auth"
        component={AuthModalScreen}
        options={{presentation: "modal", gestureEnabled: true}}
      />
    </Stack.Navigator>
  );
};
