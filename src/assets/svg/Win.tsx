import * as React from "react";
import Svg, {SvgProps, Path} from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: style */
export const Win = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    id="Uploaded to svgrepo.com"
    width={800}
    height={800}
    viewBox="0 0 32 32"
    {...props}
  >
    <Path
      d="M20 23h-8v5h-1v2h10v-2h-1v-5zm-6 2h4v1h-4v-1zm0 3v-1h4v1h-4zM24 2H8C5.243 2 3 4.243 3 7s2.243 5 5 5c0 4.079 3.055 7.438 7 7.931V22h2v-2.069c3.945-.493 7-3.852 7-7.931 2.757 0 5-2.243 5-5s-2.243-5-5-5zM5 7c0-1.654 1.346-3 3-3v6c-1.654 0-3-1.346-3-3zm19 3V4c1.654 0 3 1.346 3 3s-1.346 3-3 3z"
      fill={"#f2ef1d"}
    />
  </Svg>
);
