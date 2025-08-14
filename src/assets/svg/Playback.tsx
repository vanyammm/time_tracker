import * as React from "react";
import Svg, {SvgProps, Path} from "react-native-svg";
export const Playback = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    viewBox="0 0 16 16"
    {...props}
  >
    <Path
      fill="#fff"
      d="M2 2.5v11c0 1.5 1.27 1.492 1.27 1.492h.128c.247.004.489-.05.7-.172l9.797-5.597c.433-.243.656-.735.656-1.227 0-.492-.223-.984-.656-1.223L4.098 1.176a1.399 1.399 0 0 0-.7-.176H3.27S2 1 2 2.5zm0 0"
    />
  </Svg>
);
