import {StyleSheet} from "react-native";
import {COLORS} from "../../theme/colors";

export const styles = StyleSheet.create({
  modal: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.dark,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    maxHeight: "95%",
    justifyContent: "flex-end",
    backgroundColor: COLORS.dark,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    flex: 1,
    padding: 17,
  },
  userCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  copyButton: {
    borderRadius: 10,
    backgroundColor: COLORS.blue,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    backgroundColor: COLORS.darkBlue,
    color: "white",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
});
