import {StyleSheet} from "react-native";
import {COLORS} from "../../theme/colors";

export const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: COLORS.dark,
    // backgroundColor: "red",
    flex: 1,
  },
  closeModalButton: {
    alignSelf: "flex-end",
    marginRight: 10,
    marginBottom: 25,
  },
  groupedChallengesListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
    alignItems: "center",
  },
  selectButton: {
    width: 20,
    height: 20,
    borderRadius: 8,
    backgroundColor: "transparent",
    borderColor: "white",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedView: {
    width: 12,
    height: 12,
    borderRadius: 5,
    backgroundColor: "white",
  },
});
