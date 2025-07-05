import {StyleSheet} from "react-native";
import {COLORS} from "../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBlue,
  },
  footer: {
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: COLORS.darkBlue,
    // backgroundColor: "pink",
  },
  buttonsContainer: {
    alignItems: "center",
    // backgroundColor: "purple",
  },
  nextButton: {
    paddingVertical: 17,
    paddingHorizontal: 75,
    borderRadius: 25,
  },
  skipButton: {
    backgroundColor: "transparent",
  },
  nextButtonText: {
    color: COLORS.darkBlue,
    fontSize: 16,
    fontWeight: "bold",
  },
  skipButton: {
    padding: 10,
  },
  skipButtonText: {
    color: "gray",
    fontSize: 16,
  },
});
