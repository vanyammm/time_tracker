import React, {ReactNode} from "react";
import {StyleProp, View, ViewStyle, StyleSheet, Text} from "react-native";
import {Canvas, Circle, LinearGradient, vec} from "@shopify/react-native-skia";
import {styles} from "./styles";

interface UserAvatarCircleProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  gradientColors: string[];
}

export const UserAvatarCircle: React.FC<UserAvatarCircleProps> = ({
  gradientColors,
  children,
  style,
}) => {
  const flattenedStyle = StyleSheet.flatten(style);

  const size =
    typeof flattenedStyle?.width === "number" ? flattenedStyle.width : 70;
  const radius = size / 2;

  const colors =
    gradientColors && gradientColors.length >= 2
      ? gradientColors
      : ["#888", "#555"];

  return (
    <View style={[style]}>
      <Canvas style={{width: size, height: size}}>
        <Circle cx={radius} cy={radius} r={radius}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(size, size)}
            colors={colors}
          />
        </Circle>
      </Canvas>
      {children && <View style={styles.childrenContainer}>{children}</View>}
    </View>
  );
};
