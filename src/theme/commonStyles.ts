import {StyleSheet} from "react-native";
import {COLORS} from "./colors";

const NORMAL_TEXT_SIZE = 16;
const BIGGER_TEXT_SIZE = 18;
const BOLD_TEXT = "600";
export const GREEN_BUTTON_WIDTH = 250;

export const common = StyleSheet.create({
  whiteText: {
    color: "white",
  },
  normalSizeText: {
    fontSize: NORMAL_TEXT_SIZE,
  },
  boldText: {
    fontWeight: "600",
  },
  normalBoldText: {
    fontSize: NORMAL_TEXT_SIZE,
    fontWeight: 600,
  },
  whiteNormalText: {
    fontSize: NORMAL_TEXT_SIZE,
    color: "white",
  },
  whiteNormalBoldText: {
    fontSize: NORMAL_TEXT_SIZE,
    color: "white",
    fontWeight: BOLD_TEXT,
  },
  grayBiggerText: {
    fontSize: BIGGER_TEXT_SIZE,
    color: COLORS.lightGray,
  },
});
