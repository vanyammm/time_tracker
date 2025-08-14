import * as React from "react";
import Svg, {SvgProps, Path} from "react-native-svg";
export const UserXMark = (props: SvgProps) => (
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
      d="m15 16 5 5m0-5-5 5M4 21a7 7 0 0 1 7-7m4-7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
    />
  </Svg>
);
