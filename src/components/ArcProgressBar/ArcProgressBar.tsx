import React, {useState} from "react";
import {Canvas, Path, Skia, SkPath, useFont} from "@shopify/react-native-skia";
import {useDerivedValue, withTiming} from "react-native-reanimated";
import {Text, View} from "react-native";
import {common, NORMAL_TEXT_SIZE} from "../../theme/commonStyles";
import {styles} from "./styles";

interface ArcProgressBarProps {
  progress: number; // від 0 до 1
  width: number;
  strokeWidth: number;
}

export const ArcProgressBar: React.FC<ArcProgressBarProps> = ({
  progress,
  width,
  strokeWidth,
}) => {
  const height = width / 2;

  // Створюємо наш SVG-шлях для дуги
  const path: SkPath | null = Skia.Path.MakeFromSVGString(
    `M ${strokeWidth / 2} ${height + 10} A ${(width - strokeWidth) / 2.3} ${
      height / 1.5
    } 0 0 1 ${width - strokeWidth / 2} ${height + 10}`,
  );

  if (!path) {
    return null;
  }

  // Створюємо анімоване значення для плавності
  const animatedProgress = useDerivedValue(() => {
    return withTiming(progress, {duration: 300});
  }, [progress]);

  const [textWidth, setTextWidth] = useState(0);

  return (
    <View style={{marginBottom: 45}}>
      <Canvas style={{width, height: height + strokeWidth}}>
        {/* 1. Малюємо фонову дугу (завжди повна) */}
        <Path
          path={path}
          style="stroke"
          strokeWidth={strokeWidth}
          strokeCap="round"
          color="rgba(255, 255, 255, 0.2)"
          start={0}
          end={1}
        />

        {/* 2. Малюємо дугу прогресу поверх фонової */}
        <Path
          path={path}
          style="stroke"
          strokeWidth={strokeWidth - 6}
          strokeCap="round"
          color="white"
          start={0}
          // Властивість `end` напряму керує довжиною дуги.
          // Ми просто передаємо сюди наше анімоване значення прогресу.
          end={animatedProgress}
        />
      </Canvas>
      <View
        style={[
          styles.progressInfo,
          {top: height / 1.4, left: width / 2 - textWidth / 2},
        ]}
      >
        <Text style={[common.whiteHugeText]}>74%</Text>
        <Text
          style={[common.grayNormalText]}
          onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
        >
          of daily goal
        </Text>
      </View>
    </View>
  );
};
