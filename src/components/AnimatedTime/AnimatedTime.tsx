import React, {useCallback, useEffect, useRef, useState} from "react";
import {View, StyleSheet, Text} from "react-native";
import AnimatedNumbers from "react-native-animated-numbers";

interface AnimatedTimeProps {
  hours: number;
  minutes: number;
  seconds: number;
}

const AnimatedTimeUnit: React.FC<{value: number}> = React.memo(({value}) => {
  return (
    <View style={styles.timeUnitContainer}>
      {value < 10 && <Text style={styles.digitText}>0</Text>}
      <AnimatedNumbers
        animateToNumber={value}
        animationDuration={300}
        fontStyle={styles.digitText}
      />
    </View>
  );
});

export const AnimatedTime: React.FC<AnimatedTimeProps> = ({
  hours,
  minutes,
  seconds,
}) => {
  return (
    <View style={styles.container}>
      <AnimatedTimeUnit value={hours} />
      <Text style={styles.separator}>:</Text>
      <AnimatedTimeUnit value={minutes} />
      <Text style={styles.separator}>:</Text>
      <AnimatedTimeUnit value={Math.floor(seconds)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeUnitContainer: {
    flexDirection: "row",
  },
  digitText: {
    color: "white",
    fontSize: 37,
    fontWeight: "800",
  },
  separator: {
    color: "white",
    fontSize: 37,
    fontWeight: "800",
    marginHorizontal: 5,
    paddingBottom: 4,
  },
});
