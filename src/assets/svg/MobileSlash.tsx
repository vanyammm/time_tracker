import * as React from "react";
import Svg, {SvgProps, Path} from "react-native-svg";
export const MobileSlash = (props: SvgProps) => (
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
      d="m3 3 18 18m-9-3h.01M6 6v11.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C7.52 21 8.08 21 9.2 21H15c.932 0 1.398 0 1.765-.152a2 2 0 0 0 1.083-1.083C18 19.398 18 18.932 18 18M8.65 3h6.15c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C18 4.52 18 5.08 18 6.2v6.15"
    />
  </Svg>
);
