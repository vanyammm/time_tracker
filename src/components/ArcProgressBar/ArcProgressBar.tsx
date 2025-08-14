import React, {useState} from "react";
import {Canvas, Path, Skia, SkPath, useFont} from "@shopify/react-native-skia";
import {useDerivedValue, withTiming} from "react-native-reanimated";
import {Text, View} from "react-native";
import {common} from "../../theme/commonStyles";
import {styles} from "./styles";

interface ArcProgressBarProps {
  progress: number;
  inModal?: boolean;
  progressInSeconds?: number;
  streakMode?: boolean;
}

export const ArcProgressBar: React.FC<ArcProgressBarProps> = ({
  progress,
  inModal,
  progressInSeconds,
  streakMode = false,
}) => {
  const width = 247;
  const strokeWidth = 21;
  const height = width / 2;

  const path: SkPath | null = Skia.Path.MakeFromSVGString(
    `M ${strokeWidth / 2} ${height + 10} A ${(width - strokeWidth) / 2.3} ${
      height / 1.5
    } 0 0 1 ${width - strokeWidth / 2} ${height + 10}`,
  );

  if (!path) {
    return null;
  }

  const animatedProgress = useDerivedValue(() => {
    return withTiming(progress, {duration: 300});
  }, [progress]);

  const [textWidth, setTextWidth] = useState(0);

  const progressInHours =
    typeof progressInSeconds === "number"
      ? Math.floor((progressInSeconds / 3600) * 10) / 10
      : null;

  return (
    <View style={{marginBottom: 45}}>
      <Canvas style={{width, height: height + strokeWidth}}>
        <Path
          path={path}
          style="stroke"
          strokeWidth={strokeWidth}
          strokeCap="round"
          color="rgba(255, 255, 255, 0.2)"
          start={0}
          end={1}
        />
        <Path
          path={path}
          style="stroke"
          strokeWidth={strokeWidth - 6}
          strokeCap="round"
          color="white"
          start={0}
          end={animatedProgress}
        />
      </Canvas>
      <View
        style={[
          styles.progressInfo,
          {top: height / 1.4, left: width / 2 - textWidth / 2},
        ]}
      >
        <Text style={[common.whiteHugeText]}>
          {inModal ? `${Math.floor(progress * 100)}%` : `${progressInHours}`}
        </Text>
        <Text
          style={[common.grayNormalText]}
          onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
        >
          {inModal ? "of daily goal" : streakMode ? "hours today" : "hours"}
        </Text>
      </View>
    </View>
  );
};
