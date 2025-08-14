import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
  leaderBoardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leaderBoardHeaderButtons: {
    flexDirection: "row",
    gap: 5,
  },
  leaderBoardNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 10,
  },
  leaderBoardNavigationButton: {
    flex: 1,
  },
  leaderBoardTopThree: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  leaderBoardTopThreeItem: {
    justifyContent: "center",
    alignItems: "center",
  },
});
