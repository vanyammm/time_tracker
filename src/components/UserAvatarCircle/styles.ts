import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
  circle: {
    width: 70,
    height: 70,
    backgroundColor: "cadetblue",
    borderRadius: "100%",
  },
  circleWithChildren: {
    alignItems: "center",
    justifyContent: "center",
  },
  childrenContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
