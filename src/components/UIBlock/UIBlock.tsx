import React, {ReactNode} from "react";
import {styles} from "./styles";
import {StyleProp, View, ViewStyle} from "react-native";

interface UIBlockProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const UIBlock: React.FC<UIBlockProps> = ({children, style}) => {
  return <View style={[styles.UIBlock, style]}>{children}</View>;
};
