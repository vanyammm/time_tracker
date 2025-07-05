import {View, Text} from "react-native";
import {UIBlock} from "../UIBlock/UIBlock";
import {
  formatProgressTime,
  generateChallengeDescriptionString,
} from "../../utils/utils";
import {common} from "../../theme/commonStyles";
import {ChallengeCardProgressBar} from "./ChallengeCardProgressBar";
import {styles} from "./styles";
import {CircleDanger} from "../../assets/svg/CircleDanger";
import {CircleCheck} from "../../assets/svg/CircleCheck";
import {COLORS} from "../../theme/colors";

interface ChallengeCardProps {
  challengeId?: string;
  challengeStatus: "active" | "completed" | "pending" | "failed";
  type: "Race" | "Streak" | "Regular" | "Team";
  action: string;
  hoursAmount: number;
  daysAmount?: number;
  startDate: Date;
  progress: number;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challengeId,
  challengeStatus,
  type,
  action,
  hoursAmount,
  daysAmount,
  startDate,
  progress,
}) => {
  let rate: number | null = null;
  if (type !== "Race" && daysAmount) {
    rate = hoursAmount / daysAmount;
  }
  const today = new Date();
  const daysPassed = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const expectedRate = rate ? rate * daysPassed : 0;
  const expectedProgressPercentage = (expectedRate * 100) / hoursAmount;
  const progressInHours = progress / 3600; // 1 hour = 360
  const progressPercentage = (progressInHours * 100) / hoursAmount;

  let behindTheSchedule: boolean | null = null;
  if (type !== "Race" && daysAmount) {
    behindTheSchedule = progressInHours < expectedRate;
  }

  return (
    <UIBlock>
      <Text style={[common.whiteNormalBoldText]}>
        {generateChallengeDescriptionString({
          action,
          type,
          hoursAmount,
          daysAmount,
        })}
      </Text>
      <View style={[styles.challengeProgressInfo]}>
        <View style={[styles.challengeProgressInfoHeader]}>
          <Text style={[common.grayBiggerText]}>
            {formatProgressTime(progress)} / {hoursAmount}h
          </Text>
          <Text style={[common.grayBiggerText]}>
            Day {daysPassed} of {daysAmount}
          </Text>
        </View>
        <ChallengeCardProgressBar
          type={type}
          progressPercentage={progressPercentage}
          expectedProgressPercentage={expectedProgressPercentage}
        />
        <View style={[styles.challengeProgressInfoFooter]}>
          {behindTheSchedule ? (
            <View style={[styles.scheduleStatus]}>
              <CircleDanger />
              <Text style={[common.whiteNormalText, {color: COLORS.red}]}>
                Behind Schedule
              </Text>
            </View>
          ) : (
            <View style={[styles.scheduleStatus]}>
              <CircleCheck />
              <Text
                style={[common.whiteNormalText, {color: COLORS.lightGreen}]}
              >
                On Track
              </Text>
            </View>
          )}
          <Text style={[common.grayBiggerText]}>
            {hoursAmount - progressInHours}h remaining
          </Text>
        </View>
      </View>
    </UIBlock>
  );
};
