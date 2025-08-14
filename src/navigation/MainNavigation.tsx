import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {ActivityScreen} from "../screens/ActivityScreen/ActivityScreen";
import {StatiscticsScreen} from "../screens/StatisticsScreen/StatisticsScreen";
import {Diagram} from "../assets/svg/Diagram";
import {TimerSvg} from "../assets/svg/TimerSvg";
import {People} from "../assets/svg/People";

import {FriendshipScreen} from "../screens/FriendshipScreen/FriendshipScreen";
import {MainTabParamList} from "./types";
import {BlurView} from "expo-blur";

const Tab = createBottomTabNavigator<MainTabParamList>();

const BlurTabBarBackground = () => (
  <BlurView tint="dark" intensity={80} style={{flex: 1}} />
);

export const MainNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Activity"
      screenOptions={({route}) => ({
        tabBarBackground: () => <BlurTabBarBackground />,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          position: "absolute",
        },
        tabBarShowLabel: false,
        tabBarItemStyle: {
          paddingTop: 9,
        },
        tabBarIcon: ({focused}) => {
          const iconProps = {
            width: 24,
            height: 24,
            focused: focused,
          };

          switch (route.name) {
            case "Statistics":
              return <Diagram {...iconProps} />;
            case "Activity":
              return <TimerSvg {...iconProps} />;
            case "Friendship":
              return <People {...iconProps} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Statistics" component={StatiscticsScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Friendship" component={FriendshipScreen} />
    </Tab.Navigator>
  );
};
