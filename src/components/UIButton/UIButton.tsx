import {ReactNode} from "react";
import {
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
} from "react-native";
import {styles} from "./styles";
import {COLORS} from "../../theme/colors";

interface UIButtonProps {
  children: ReactNode;
  bgColor?: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}

export const UIButton: React.FC<UIButtonProps> = ({
  children,
  bgColor = COLORS.lightGreen,
  color = "white",
  style,
  onPress,
  disabled,
}) => {
  const content =
    typeof children === "string" || typeof children === "number" ? (
      <Text style={[styles.text, {color}]}>{children}</Text>
    ) : (
      children
    );
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.UIButton,
        {backgroundColor: bgColor},
        style,
        disabled && {backgroundColor: COLORS.dark, opacity: 0.8},
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {content}
    </TouchableOpacity>
  );
};
