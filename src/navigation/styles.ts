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
  },
  buttonsContainer: {
    alignItems: "center",
  },
  nextButton: {
    paddingVertical: 17,
    paddingHorizontal: 75,
    borderRadius: 25,
  },
  skipButton: {
    backgroundColor: "transparent",
    padding: 10,
  },
  nextButtonText: {
    color: COLORS.darkBlue,
    fontSize: 16,
    fontWeight: "bold",
  },
  skipButtonText: {
    color: "gray",
    fontSize: 16,
  },
});
