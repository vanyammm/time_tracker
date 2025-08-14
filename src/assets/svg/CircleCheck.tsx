import * as React from "react";
import Svg, {Path, SvgProps} from "react-native-svg";
import {COLORS} from "../../theme/colors";
export const CircleCheck = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      fill={COLORS.lightGreen}
      fillRule="evenodd"
      d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-5.97-3.03a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l1.47 1.47 2.235-2.236L14.97 8.97a.75.75 0 0 1 1.06 0Z"
      clipRule="evenodd"
    />
  </Svg>
);
