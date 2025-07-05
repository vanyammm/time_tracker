import {StyleSheet} from "react-native";
import {COLORS} from "../../theme/colors";

export const styles = StyleSheet.create({
  activityScreen: {
    paddingHorizontal: 20,
  },
  activityScreenHeader: {
    fontSize: 29,
    marginBottom: 24,
  },
  currentChallengeBlockHeader: {
    color: "white",
    fontWeight: 600,
  },
  currentChallengeStatus: {
    fontSize: 28,
    fontWeight: 800,
    marginBottom: 10,
  },
  tipBlockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  tipBlockHeaderText: {
    color: COLORS.lightGray,
  },
  schemaBlock: {
    height: 90,
    width: "100%",
    backgroundColor: COLORS.lightGreen,
    borderRadius: 10,
  },
  tipBlockSecondaryText: {
    color: COLORS.lightGray,
    fontSize: 18,
    fontWeight: 500,
  },
  socialHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },
  socialHeaderText: {
    fontSize: 29,
    fontWeight: 600,
    color: COLORS.lightGray,
  },
  socialList: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  socialListItemWrapper: {
    alignItems: "center",
    gap: 4,
  },
  socialListItem: {
    width: 70,
    height: 70,
    backgroundColor: "cadetblue",
    borderRadius: "100%",
  },
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
