import * as React from "react";
import Svg, {SvgProps, Path} from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: title */

type Props = SvgProps & {
  focused: boolean;
};

export const Diagram = (props: Props) => {
  const {focused, ...rest} = props;
  const color = focused ? "white" : "gray";
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={800}
      height={800}
      viewBox="0 0 24 24"
      {...rest}
    >
      <Path
        stroke={color}
        d="M21.27 8.26a10.16 10.16 0 0 0-1.71-2.78A10 10 0 1 0 22 12a9.87 9.87 0 0 0-.72-3.7s-.01-.03-.01-.04ZM15.41 11l3.32-3.31c.15.24.29.49.42.74L16.59 11ZM15 4.59l-2 2V5.41l1.12-1.12a9.12 9.12 0 0 1 .88.3Zm2.44 1.56L13 10.59V9.41l3.8-3.8c.2.17.43.39.64.54Zm2.42 4.4c0 .15.05.3.07.45h-.52ZM11 4.07v7.52L5.69 16.9A7.92 7.92 0 0 1 4 12a8 8 0 0 1 7-7.93ZM12 20a7.92 7.92 0 0 1-4.9-1.69L12.41 13h7.52A8 8 0 0 1 12 20Z"
      />
    </Svg>
  );
};
