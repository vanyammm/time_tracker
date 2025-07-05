import {StyleSheet} from "react-native";
import {COLORS} from "../../theme/colors";

export const styles = StyleSheet.create({
  challengeProgressBar: {
    height: 7,
    backgroundColor: COLORS.midGray,
    borderRadius: 10,
    overflow: "hidden",
  },
  challengeProgressBarScheduleMark: {
    width: 2.4,
    height: "100%",
    backgroundColor: COLORS.red,
    position: "absolute",
    zIndex: 2,
  },
  progressLine: {
    backgroundColor: COLORS.lightGreen,
    height: "100%",
    borderRadius: 10,
  },
  challengeProgressInfo: {
    gap: 7,
  },
  challengeProgressInfoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  challengeProgressInfoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scheduleStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
