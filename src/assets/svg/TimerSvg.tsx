import * as React from "react";
import Svg, {SvgProps, Path} from "react-native-svg";
export const TimerSvg = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.516 7A9 9 0 1 0 12 3v3m0 6L8 8"
    />
  </Svg>
);
