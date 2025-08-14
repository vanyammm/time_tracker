import {createStackNavigator} from "@react-navigation/stack";
import {FriendshipScreen} from "../screens/FriendshipScreen/FriendshipScreen";
import {ChallengeDetailsScreen} from "../screens/ChallengeDetailsScreen/ChallengeDetailsScreen";
import {ChallengeResultScreen} from "../screens/ChallengeResultScreen/ChallengeResultScreen";

export type ChallengeStackParamList = {
  ChallengeList: undefined;
  ChallengeDetails: {challengeId: number};
  ChallengeResult: {challengeId: number};
};

const Stack = createStackNavigator<ChallengeStackParamList>();

export const ChallengeNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ChallengeList"
      screenOptions={{
        headerShown: false,
        presentation: "modal",
      }}
    >
      <Stack.Screen
        name="ChallengeList"
        component={FriendshipScreen}
        options={{presentation: "card"}}
      />
      <Stack.Group>
        <Stack.Screen
          name="ChallengeResult"
          component={ChallengeResultScreen}
        />
        <Stack.Screen
          name="ChallengeDetails"
          component={ChallengeDetailsScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};
