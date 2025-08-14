import {StyleSheet} from "react-native";
import {COLORS} from "../../theme/colors";

export const styles = StyleSheet.create({
  header: {
    color: COLORS.lightGray,
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 14,
    textTransform: "uppercase",
    paddingTop: 25,
    paddingBottom: 10,
  },
  button: {
    backgroundColor: COLORS.lightDarkBlue,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonFirst: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  buttonLast: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  buttonSingle: {
    borderRadius: 10,
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  destructiveText: {
    color: COLORS.red,
  },
  disabledText: {
    color: COLORS.lightGray,
  },
  separator: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.darkBlue,
    paddingHorizontal: 10,
    width: "100%",
    position: "absolute",
    top: 0,
    left: 20,
  },
});
