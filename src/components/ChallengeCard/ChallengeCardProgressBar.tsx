import {View} from "react-native";
import {styles} from "./styles";
import React from "react";
import {COLORS} from "../../theme/colors";

interface ChallengeCardProgressBarProps {
  type: "regular" | "streak" | "race" | "team";

  expectedProgressPercentage?: number;
  progressPercentage: number;
}

export const ChallengeCardProgressBar: React.FC<
  ChallengeCardProgressBarProps
> = ({type, expectedProgressPercentage, progressPercentage}) => {
  return (
    <View
      style={[
        styles.challengeProgressBar,
        type === "race" ? {height: 12} : {height: 9},
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
          expectedProgressPercentage &&
          progressPercentage < expectedProgressPercentage
            ? {backgroundColor: COLORS.red, borderRadius: 3}
            : undefined,
        ]}
      />
    </View>
  );
};
