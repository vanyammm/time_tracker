import {StyleSheet} from "react-native";
import {COLORS} from "./colors";

export const NORMAL_TEXT_SIZE = 16;
export const BIGGER_TEXT_SIZE = 18;
export const BIG_TEXT_SIZE = 22;
export const HUGE_TEXT_SIZE = 33;
export const SEMI_BOLD_TEXT = 500;
export const BOLD_TEXT = 900;
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
  whiteNormalSemiBoldText: {
    fontSize: NORMAL_TEXT_SIZE,
    color: "white",
    fontWeight: SEMI_BOLD_TEXT,
  },
  whiteNormalBoldText: {
    fontSize: NORMAL_TEXT_SIZE,
    color: "white",
    fontWeight: BOLD_TEXT,
  },
  whiteBiggerText: {
    color: "white",
    fontSize: BIGGER_TEXT_SIZE,
  },
  whiteBiggerSemiBoldText: {
    color: "white",
    fontSize: BIGGER_TEXT_SIZE,
    fontWeight: SEMI_BOLD_TEXT,
  },
  whiteBiggerBoldText: {
    color: "white",
    fontSize: BIGGER_TEXT_SIZE,
    fontWeight: BOLD_TEXT,
  },
  whiteBigSemiBoldText: {
    color: "white",
    fontSize: BIG_TEXT_SIZE,
    fontWeight: SEMI_BOLD_TEXT,
  },
  whiteBigBoldText: {
    color: "white",
    fontSize: BIG_TEXT_SIZE,
    fontWeight: BOLD_TEXT,
  },
  whiteHugeText: {
    color: "white",
    fontSize: HUGE_TEXT_SIZE,
    fontWeight: 700,
  },
  grayNormalText: {
    color: COLORS.lightGray,
    fontSize: NORMAL_TEXT_SIZE,
  },
  grayNormalSemiboldText: {
    color: COLORS.lightGray,
    fontSize: NORMAL_TEXT_SIZE,
    fontWeight: SEMI_BOLD_TEXT,
  },
  grayBiggerText: {
    fontSize: BIGGER_TEXT_SIZE,
    color: COLORS.lightGray,
  },
  grayBigBoldText: {
    fontSize: BIG_TEXT_SIZE,
    fontWeight: BOLD_TEXT,
    color: COLORS.lightGray,
  },
  grayHugeBoldText: {
    fontSize: HUGE_TEXT_SIZE,
    fontWeight: BOLD_TEXT,
    color: COLORS.lightGray,
  },
});
