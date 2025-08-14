import {StyleProp, View, ViewStyle} from "react-native";
import {styles} from "./styles";
import React from "react";
import {COLORS} from "../../theme/colors";
import {ChallengeType} from "../../../db/schema";

interface ChallengeCardProgressBarProps {
  type: ChallengeType;

  expectedProgressPercentage?: number;
  progressPercentage: number;
  style?: StyleProp<ViewStyle>;
  isDayLost?: boolean;
}

export const ChallengeCardProgressBar: React.FC<
  ChallengeCardProgressBarProps
> = ({
  type,
  expectedProgressPercentage,
  progressPercentage,
  style,
  isDayLost = false,
}) => {
  return (
    <View
      style={[
        styles.challengeProgressBar,
        type === "race" ? {height: 12} : {height: 9},
        style,
      ]}
    >
      {type !== "race" && expectedProgressPercentage && (
        <View
          style={[
            styles.challengeProgressBarScheduleMark,
            {left: `${expectedProgressPercentage}%`},
            progressPercentage >= expectedProgressPercentage
              ? {backgroundColor: "white"}
              : undefined,
          ]}
        />
      )}
      <View
        style={[
          styles.progressLine,
          {width: `${progressPercentage}%`},
          (expectedProgressPercentage &&
            progressPercentage < expectedProgressPercentage) ||
          isDayLost
            ? {backgroundColor: COLORS.red, borderRadius: 3}
            : undefined,
          type === "streak" ? {borderRadius: 3} : undefined,
        ]}
      />
    </View>
  );
};
