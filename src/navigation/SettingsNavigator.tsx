import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import {SettingsScreen} from "../screens/SettingsScreen/SettingsScreen";
import {COLORS} from "../theme/colors";
import {EditProfileScreen} from "../screens/SettingsScreen/EditProfileScreen";
import {ManageFriendshipsScreen} from "../screens/ManageFriendshipsScreen/ManageFriendshipsScreen";
import {DailyFocusScreen} from "../screens/SettingsScreen/DailyFocusScreen";
export type SettingsStackParamList = {
  SettingsHome: undefined;
  EditProfile: undefined;
  ManageFriendships: undefined;
  DailyGoal: undefined;
};

const Stack = createStackNavigator<SettingsStackParamList>();

export const SettingsNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="SettingsHome"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.darkBlue,
          shadowOpacity: 0,
        },
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerBackTitle: "Settings",
      }}
    >
      <Stack.Screen
        name="SettingsHome"
        component={SettingsScreen}
        options={{title: "Settings", headerBackTitle: "Back"}}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{title: "Profile Settings"}}
      />
      <Stack.Screen
        name="ManageFriendships"
        component={ManageFriendshipsScreen}
        options={{title: ""}}
      />
      <Stack.Screen
        name="DailyGoal"
        component={DailyFocusScreen}
        options={{title: ""}}
      />
    </Stack.Navigator>
  );
};
