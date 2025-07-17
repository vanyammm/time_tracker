import * as React from "react";
import Svg, {Path} from "react-native-svg";
import {COLORS} from "../../theme/colors";
export const CircleXMark = () => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={28}
    fill="none"
    viewBox="0 0 24 24"
  >
    <Path
      stroke={COLORS.lightGray}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m9 9 6 6m0-6-6 6m12-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </Svg>
);
