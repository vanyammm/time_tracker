import * as React from "react";
import Svg, {SvgProps, Path} from "react-native-svg";
export const Next = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={30}
    height={30}
    viewBox="0 0 24 24"
    {...props}
  >
    <Path d="m6.8 23.7-1.4-1.4L15.7 12 5.4 1.7 6.8.3 18.5 12z" />
  </Svg>
);
