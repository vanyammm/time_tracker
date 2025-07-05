import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {ActivityScreen} from "../screens/ActivityScreen/ActivityScreen";
import {FriendshipScreen} from "../screens/FriendshipScreen/FriendshipScreen";
import {StatiscticsScreen} from "../screens/StatisticsScreen/StatisticsScreen";
import {COLORS} from "../theme/colors";
import {Diagram} from "../assets/svg/Diagram";
import {TimerSvg} from "../assets/svg/TimerSvg";
import {People} from "../assets/svg/People";

const Tab = createBottomTabNavigator();

export const MainNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {backgroundColor: COLORS.darkBlue},
        tabBarShowLabel: false,
        tabBarItemStyle: {
          paddingTop: 9,
        },
        tabBarIcon: ({focused}) => {
          const iconProps = {
            width: 24,
            height: 24,
            fill: focused ? "white" : "gray", // або будь-яка логіка кольору
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
