import React, {useState} from "react";
import {View, StyleSheet, Button, Text, Dimensions} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import {common} from "../../../theme/commonStyles";
import {Timer} from "../../../components/Timer/Timer";
import {UIButton} from "../../../components/UIButton/UIButton";
import {TimerSlide} from "./TimerSlide";
import {TimerConfigurationSlide} from "./TimerConfigurationSlide";

const {height, width} = Dimensions.get("window");

export const TimerSlider: React.FC = () => {
  const pages = [
    <TimerSlide key="page1" />,
    <TimerConfigurationSlide key="page2" />,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View>
      <Carousel
        loop={false}
        width={width - 11 * 2}
        height={height * 0.6}
        autoPlay={false}
        data={pages}
        scrollAnimationDuration={500}
        renderItem={({item}) => item}
        onSnapToItem={(index) => setCurrentIndex(index)}
      />
      <View style={styles.dotsContainer}>
        {pages.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  page: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "#add8e6",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  screenHeader: {
    fontSize: 37,
    fontWeight: "800",
  },
  timerType: {
    marginBottom: 10,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#333",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#ccc",
  },
});
