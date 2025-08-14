import {BottomTabBar, BottomTabBarProps} from "@react-navigation/bottom-tabs";
import {StyleSheet, View} from "react-native";
import {BlurView} from "expo-blur";

export const CustomTabBar = (props: BottomTabBarProps) => {
  return (
    <View style={styles.container}>
      <BottomTabBar {...props} style={styles.tabBar} />
      <BlurView intensity={80} tint="dark" style={{flex: 1}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  tabBar: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
  },
});
