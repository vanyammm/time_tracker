import {Text, View} from "react-native";
import {common} from "../../theme/commonStyles";
import {COLORS} from "../../theme/colors";
import {calculateStreakStats} from "../../utils/utils";

interface Props {
  dailyStreakProgress: number[];
  hoursAmount: number;
  daysPassed: number;
}

export const StreakCountBlock: React.FC<Props> = ({
  dailyStreakProgress,
  hoursAmount,
  daysPassed,
}) => {
  const {wonDays, lostDays} = calculateStreakStats(
    dailyStreakProgress,
    hoursAmount,
    daysPassed,
  );

  return (
    <View style={{flexDirection: "row", gap: 10, alignItems: "center"}}>
      <View style={{flexDirection: "row", gap: 5, alignItems: "center"}}>
        <Text style={[common.whiteNormalSemiBoldText]}>{wonDays}</Text>
        <View
          style={{
            width: 13,
            height: 13,
            backgroundColor: COLORS.lightGreen,
            borderRadius: 4,
          }}
        />
      </View>
      <View style={{flexDirection: "row", gap: 5, alignItems: "center"}}>
        <Text style={[common.whiteNormalSemiBoldText]}>{lostDays}</Text>
        <View
          style={{
            width: 13,
            height: 13,
            backgroundColor: COLORS.red,
            borderRadius: 4,
          }}
        />
      </View>
    </View>
  );
};
