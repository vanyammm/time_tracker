import React, {ReactNode} from "react";
import {styles} from "./styles";
import {View} from "react-native";

interface UIBlockProps {
  children: ReactNode;
}

export const UIBlock: React.FC<UIBlockProps> = ({children}) => {
  return <View style={styles.UIBlock}>{children}</View>;
};
