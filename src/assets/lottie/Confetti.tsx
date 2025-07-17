import React from "react";
import {StyleSheet, View} from "react-native";
import LottieView from "lottie-react-native";

interface ConfettiProps {
  onFinish: () => void;
}

export const Confetti: React.FC<ConfettiProps> = ({onFinish}) => {
  return (
    <LottieView
      source={require("./confetti.json")}
      autoPlay
      loop={false}
      onAnimationFinish={onFinish}
      style={[styles.confetti]}
      speed={2}
    />
  );
};

const styles = StyleSheet.create({
  confetti: {
    position: "absolute",
    // top: 0,
    // bottom: 0,
    // left: 0,
    // right: 0,
    zIndex: 10,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    // backgroundColor: "red",
  },
});
