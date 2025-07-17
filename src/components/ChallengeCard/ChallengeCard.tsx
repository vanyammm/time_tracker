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
import {useGetChallengeParticipantsQuery} from "../../store/api/apiSlice";
import {useUserStore} from "../../store/userStore";
import {ChallengeParticipants} from "./ChallengeParticipants";

interface ChallengeCard {
  id?: string;
  challengeStatus: "active" | "finished" | "pending";
  type: "race" | "streak" | "regular" | "team";
  action: string;
  hoursAmount: number;
  daysAmount?: number;
  startDate: Date;
  buyIn: number;
}

interface ChallengeCardProps {
  challenge: ChallengeCard;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({challenge}) => {
  const {type, hoursAmount, daysAmount, startDate, action, challengeStatus} =
    challenge;

  const challengeDescription = (
    <Text style={[common.whiteNormalBoldText]}>
      {generateChallengeDescriptionString({
        action,
        type,
        hoursAmount,
        daysAmount,
      })}
    </Text>
  );

  if (challengeStatus === "finished") {
  }

  const {data: participants, isLoading} = useGetChallengeParticipantsQuery(
    Number(challenge.id),
  );
  const currentUser = useUserStore((state) => state.user);

  const userProgress = participants?.find(
    (participant) => participant.userId === currentUser?.id,
  )?.progress;

  // console.log("USER PROGRESS", userProgress);

  let rate: number | null = null;
  if (type !== "race" && daysAmount) {
    rate = hoursAmount / daysAmount;
  }
  const today = new Date();
  const startDateObj =
    startDate instanceof Date ? startDate : new Date(startDate);
  const daysPassed =
    Math.floor(
      (today.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1;
  const expectedRate = rate ? rate * daysPassed : 0;
  const expectedProgressPercentage = (expectedRate * 100) / hoursAmount;
  const progressInHours = userProgress ? userProgress / 3600 : 0;
  const progressPercentage = (progressInHours * 100) / hoursAmount;

  let behindTheSchedule: boolean | null = null;
  if (type !== "race" && daysAmount) {
    behindTheSchedule = progressInHours < expectedRate;
  }

  return (
    <UIBlock>
      {challengeDescription}
      <View style={[styles.challengeProgressInfo]}>
        <View style={[styles.challengeProgressInfoHeader]}>
          <Text style={[common.grayBiggerText]}>
            {type === "race"
              ? `Goal: ${hoursAmount}h`
              : userProgress
              ? `${formatProgressTime(userProgress)} / ${hoursAmount}h`
              : "0s"}
          </Text>
          {type !== "race" ? (
            <Text style={[common.grayBiggerText]}>
              Day {daysPassed} of {daysAmount}
            </Text>
          ) : (
            <Text style={[common.grayBiggerText]}>
              {Math.floor((hoursAmount - progressInHours) * 10) / 10}h remaining
            </Text>
          )}
        </View>
        <ChallengeCardProgressBar
          type={type}
          progressPercentage={progressPercentage}
          expectedProgressPercentage={expectedProgressPercentage}
        />
        {type !== "race" && (
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
              {Math.floor((hoursAmount - progressInHours) * 10) / 10}h remaining
            </Text>
          </View>
        )}
        <ChallengeParticipants type="race" participants={[1]} />
      </View>
    </UIBlock>
  );
};
