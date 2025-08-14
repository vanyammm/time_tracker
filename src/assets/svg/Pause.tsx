import * as React from "react";
import Svg, {SvgProps, Path} from "react-native-svg";
export const Pause = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <Path strokeWidth={0.4} fill="#fff" d="M7 1H2v14h5V1ZM14 1H9v14h5V1Z" />
  </Svg>
);
