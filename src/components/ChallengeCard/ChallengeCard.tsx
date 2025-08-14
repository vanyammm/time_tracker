import {View, Text} from "react-native";
import {UIBlock} from "../UIBlock/UIBlock";
import {
  calculateDaysPassed,
  calculateTimeBeforeStart,
  formatDate,
  formatProgressTime,
  formatTimeFromDate,
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
import {Challenge, ChallengeWithMyDetails} from "../../../db/schema";
import {UIButton} from "../UIButton/UIButton";
import {FinishFlag} from "../../assets/svg/FinishFlag";
import {StreakProgressBars} from "./StreakProgressBars";
import {StreakCountBlock} from "./StreakCountBlock";

interface ChallengeCardProps {
  challenge: ChallengeWithMyDetails;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({challenge}) => {
  const {
    id,
    type,
    hoursAmount,
    daysAmount,
    startDate,
    action,
    status,
    myStatus,
    myProgress,
    isResultViewed,
    myDailyStreakProgress,
  } = challenge;

  const challengeDescription = (
    <Text style={[common.whiteNormalText, {fontWeight: 700}]}>
      {generateChallengeDescriptionString({
        action,
        type,
        hoursAmount,
        daysAmount: daysAmount ? daysAmount : undefined,
      })}
    </Text>
  );

  if (status === "finished") {
    return (
      <UIBlock>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          {challengeDescription}
          <FinishFlag width={20} height={20} />
        </View>
        <Text style={[common.whiteNormalText, styles.currentChallengeStatus]}>
          Challenge is over
        </Text>
        <UIButton>View Result</UIButton>
      </UIBlock>
    );
  }

  if (status === "pending") {
    const timeBeforeStart = calculateTimeBeforeStart(
      challenge.startDate,
      "pending",
    );

    return (
      <UIBlock>
        <Text style={[common.whiteNormalBoldText]}>
          {generateChallengeDescriptionString({
            action: challenge.action,
            type: challenge.type,
            hoursAmount: challenge.hoursAmount,
            daysAmount: challenge.daysAmount ? challenge.daysAmount : undefined,
          })}
        </Text>
        {timeBeforeStart && (
          <Text style={[common.whiteBigBoldText]}>
            Starts in {formatProgressTime(timeBeforeStart, "detailed")}
          </Text>
        )}
        <Text style={[common.grayNormalText]}>
          Starting on {formatDate(challenge.startDate)} at{" "}
          {formatTimeFromDate(challenge.startDate)}
        </Text>
      </UIBlock>
    );
  }

  const {data: participants, isLoading} = useGetChallengeParticipantsQuery(
    Number(challenge.id),
  );

  let rate: number | null = null;
  if (type !== "race" && daysAmount) {
    rate = hoursAmount / daysAmount;
  }

  const daysPassed = calculateDaysPassed(startDate);
  const expectedRate = rate ? rate * daysPassed : 0;
  const expectedProgressPercentage = (expectedRate * 100) / hoursAmount;
  const progressInHours = myProgress ? myProgress / 3600 : 0;
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
          {type === "streak" ? (
            <>
              {myDailyStreakProgress && (
                <StreakCountBlock
                  hoursAmount={hoursAmount}
                  dailyStreakProgress={myDailyStreakProgress}
                  daysPassed={daysPassed}
                />
              )}
            </>
          ) : (
            <Text style={[common.grayBiggerText]}>
              {type === "race"
                ? `Goal: ${hoursAmount}h`
                : myProgress
                ? `${formatProgressTime(myProgress)} / ${hoursAmount}h`
                : "0s"}
            </Text>
          )}
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
        {type !== "streak" ? (
          <ChallengeCardProgressBar
            type={type}
            progressPercentage={progressPercentage}
            expectedProgressPercentage={expectedProgressPercentage}
          />
        ) : (
          <>
            {myDailyStreakProgress && (
              <StreakProgressBars
                hoursAmount={hoursAmount}
                myDailyStreakProgress={myDailyStreakProgress}
                daysPassed={daysPassed}
              />
            )}
          </>
        )}
        {type === "streak" ? undefined : (
          <>
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
                      style={[
                        common.whiteNormalText,
                        {color: COLORS.lightGreen},
                      ]}
                    >
                      On Track
                    </Text>
                  </View>
                )}
                <Text style={[common.grayBiggerText]}>
                  {Math.floor((hoursAmount - progressInHours) * 10) / 10}h
                  remaining
                </Text>
              </View>
            )}
          </>
        )}
        {participants && type !== "streak" && (
          <ChallengeParticipants type="race" participants={participants} />
        )}
      </View>
    </UIBlock>
  );
};
