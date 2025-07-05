import {StyleSheet} from "react-native";
import {COLORS} from "../../../theme/colors";

export const styles = StyleSheet.create({
  timerConfigurationContainer: {
    alignItems: "center",
    gap: 9,
    justifyContent: "center",
    flex: 1,
  },
  timerSettingsHeaderText: {
    fontSize: 24,
    fontWeight: 800,
    color: COLORS.lightGray,
    marginBottom: 5,
  },
  timerModeButtons: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "space-between",
    width: "100%",
  },
  timerModeButton: {
    backgroundColor: COLORS.dark,
    color: "white",
    paddingVertical: 15,
    paddingHorizontal: 19,
    borderRadius: 14,
  },
  lockAppsTipBlock: {
    backgroundColor: COLORS.dark,
    padding: 14,
    width: "100%",
    borderRadius: 13,
    flexDirection: "row",
    gap: 4,
    justifyContent: "space-between",
  },
  lockAppsTipBlockPrimaryText: {
    fontSize: 19,
    fontWeight: 700,
    color: "white",
  },
  lockAppsTipBlockSecondaryText: {
    fontSize: 15,
    color: COLORS.lightGray,
  },
  phoneIconMock: {
    width: 40,
    height: 44,
    backgroundColor: COLORS.darkBlue,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  screenHeader: {
    fontSize: 37,
    fontWeight: "800",
  },
  timerType: {
    marginBottom: 36,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#333",
  },
});
