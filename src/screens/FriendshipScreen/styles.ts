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
    marginRight: 15,
  },
  socialListItem: {
    width: 70,
    height: 70,
    backgroundColor: "cadetblue",
    borderRadius: "100%",
  },
});
