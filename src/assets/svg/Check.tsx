import * as React from "react";
import Svg, {SvgProps, Path} from "react-native-svg";
export const Check = (props: SvgProps) => (
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
      strokeWidth={2.3}
      d="M4 12.611 8.923 17.5 20 6.5"
    />
  </Svg>
);
