import {StyleSheet} from "react-native";
import {COLORS} from "../../theme/colors";

export const styles = StyleSheet.create({
  onBoardingScreen: {
    backgroundColor: COLORS.darkBlue,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  screenHeaderText: {
    fontSize: 33,
    fontWeight: 800,
    textAlign: "center",
    color: "white",
    marginBottom: 15,
  },
  screenMainText: {
    fontSize: 22,
    fontWeight: 800,
    color: "#dbdbdb",
    textAlign: "center",
  },
  screenSecondaryText: {
    color: COLORS.lightGray,
    fontSize: 18,
  },
});
