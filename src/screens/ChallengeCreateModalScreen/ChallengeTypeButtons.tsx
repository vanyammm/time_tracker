import {FlatList, Text, TouchableOpacity, View, Pressable} from "react-native";
import {styles} from "./styles";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {memo, useEffect, useState} from "react";

export const challengeTypes = ["Regular", "Streak", "Race", "Team"] as const;

interface ChallengeTypeButtonsProps {
  width: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

interface renderItemProps {
  item: string;
  index: number;
}

const UnmemorizedChallengeTypeButtons: React.FC<ChallengeTypeButtonsProps> = ({
  width,
  activeIndex,
  setActiveIndex,
}) => {
  const selectedIndex = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    let X = activeIndex === 0 || activeIndex === 2 ? 0 : containerWidth * 0.5;
    let Y = activeIndex === 0 || activeIndex === 1 ? 0 : 67;

    translateX.value = withTiming(X);
    translateY.value = withTiming(Y);
  }, [activeIndex]);

  const highlightAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}, {translateY: translateY.value}],
  }));

  const buttonStyle = (index: number) => ({
    backgroundColor: activeIndex === index ? "white" : "lightgray",
    borderColor: activeIndex === index ? "black" : "transparent",
    borderWidth: activeIndex === index ? 1 : 0,
  });

  const renderItem = ({item, index}: renderItemProps) => (
    <Pressable style={[styles.button]} onPress={() => setActiveIndex(index)}>
      <Text style={[styles.buttonText, styles.boldText, {zIndex: 3}]}>
        {item}
      </Text>
    </Pressable>
  );

  return (
    <View
      style={styles.challengeTypeContainer}
      onLayout={(event) => {
        setContainerWidth(event.nativeEvent.layout.width);
      }}
    >
      <Animated.View
        style={[
          styles.activeButtonHighlight,
          {width: containerWidth * 0.5 - 10},
          highlightAnimatedStyle,
        ]}
        pointerEvents="none"
      />
      <FlatList
        data={challengeTypes}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        scrollEnabled={false}
      />
    </View>
  );
};

export const ChallengeTypeButtons = memo(UnmemorizedChallengeTypeButtons);
