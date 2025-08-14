import React from "react";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import {ChallengeCreateModalScreen} from "../screens/ChallengeCreateModalScreen/ChallengeCreateModalScreen";
import {SelectFriendsScreen} from "../screens/SelectFriendsScreen/SelectFriendsScreen";
import {COLORS} from "../theme/colors";

export type ChallengeCreationStackParamList = {
  ChallengeCreateModal: {
    onboarding: boolean;
  };
  SelectFriends: {
    userId: number;
  };
};

const Stack = createStackNavigator<ChallengeCreationStackParamList>();

export const ChallengeCreationNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ChallengeCreateModal"
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        name="ChallengeCreateModal"
        component={ChallengeCreateModalScreen}
      />
      <Stack.Screen
        name="SelectFriends"
        component={SelectFriendsScreen}
        options={{
          headerShown: true,
          title: "Select Friends",
          headerStyle: {backgroundColor: COLORS.darkBlue},
          headerTintColor: "white",
        }}
      />
    </Stack.Navigator>
  );
};
