import {View} from "react-native";
import {ChallengeCardProgressBar} from "./ChallengeCardProgressBar";

interface Props {
  myDailyStreakProgress: number[];
  hoursAmount: number;
  daysPassed: number;
}

export const StreakProgressBars: React.FC<Props> = ({
  myDailyStreakProgress,
  hoursAmount,
  daysPassed,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 4,
        height: 22,
      }}
    >
      {myDailyStreakProgress?.map((dailyProgress, index) => {
        let isDayLost = false;
        if (index < daysPassed - 1) {
          const dayProgress = myDailyStreakProgress[index] || 0;
          if (dayProgress < hoursAmount * 3600) isDayLost = true;
        }
        const progressPercentage = isDayLost
          ? 100
          : ((dailyProgress / 3600) * 100) / hoursAmount;

        return (
          <ChallengeCardProgressBar
            key={index}
            type="streak"
            progressPercentage={progressPercentage}
            style={{flex: 1, height: "100%", borderRadius: 4}}
            isDayLost={isDayLost}
          />
        );
      })}
    </View>
  );
};
