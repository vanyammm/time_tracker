import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import {common} from "../../theme/commonStyles";
import {COLORS} from "../../theme/colors";

interface AnimatedSegmentedControlProps {
  options: readonly string[];
  onSelect: (option: string, index: number) => void;
  style?: any;
}

export const AnimatedSegmentedControl: React.FC<
  AnimatedSegmentedControlProps
> = ({options, onSelect, style}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [buttonLayouts, setButtonLayouts] = useState<
    {x: number; width: number}[]
  >([]);
  const translateX = useSharedValue(0);
  const highlightWidth = useSharedValue(0);

  useEffect(() => {
    if (buttonLayouts[activeIndex]) {
      const {x, width} = buttonLayouts[activeIndex];
      translateX.value = withSpring(x, {damping: 15, stiffness: 120});
      highlightWidth.value = withSpring(width, {damping: 15, stiffness: 120});
    }
  }, [activeIndex, buttonLayouts]);

  const highlightAnimatedStyle = useAnimatedStyle(() => ({
    width: highlightWidth.value,
    transform: [{translateX: translateX.value}],
  }));

  const handlePress = (index: number) => {
    setActiveIndex(index);
    onSelect(options[index], index);
  };

  return (
    <View style={[styles.container, style]}>
      {buttonLayouts.length > 0 && (
        <Animated.View style={[styles.highlight, highlightAnimatedStyle]} />
      )}
      {options.map((option, index) => (
        <Pressable
          key={option}
          style={styles.button}
          onPress={() => handlePress(index)}
          onLayout={(event: LayoutChangeEvent) => {
            const {x, width} = event.nativeEvent.layout;
            setButtonLayouts((prev) => {
              const newLayouts = [...prev];
              newLayouts[index] = {x, width};
              return newLayouts;
            });
          }}
        >
          <Text
            style={[
              common.whiteNormalBoldText,
              activeIndex === index ? {color: "black"} : undefined,
            ]}
          >
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: COLORS.dark,
    borderRadius: 9,
    height: 40,
    position: "relative",
    padding: 4,
  },
  highlight: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 7,
    top: 4,
    bottom: 4,
    zIndex: 0,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});
