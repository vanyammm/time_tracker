import {View, StyleSheet, Text} from "react-native";
import {UIBlock} from "../../components/UIBlock/UIBlock";
import {UserAvatarCircle} from "../../components/UserAvatarCircle/UserAvatarCircle";
import {common} from "../../theme/commonStyles";
import {formatProgressTime} from "../../utils/utils";
import {COLORS} from "../../theme/colors";
import {ChallengeCardProgressBar} from "../../components/ChallengeCard/ChallengeCardProgressBar";
import {StreakProgressBars} from "../../components/ChallengeCard/StreakProgressBars";
import {StreakCountBlock} from "../../components/ChallengeCard/StreakCountBlock";
import {Coin} from "../../../assets/Coin";
import React from "react";
import {CircleCheck} from "../../assets/svg/CircleCheck";
import {
  ChallengeStatus,
  ChallengeType,
  ParticipantStatus,
} from "../../../db/schema";

interface ParticipantProps {
  challengeType?: ChallengeType;
  challengeStatus?: ChallengeStatus;
  username: string;
  gradientColors: string[];
  progress?: number;
  hoursAmount?: number;
  status?: ParticipantStatus;
  daysPassed?: number;
  dailyStreakProgress?: number[] | null;
  challengeCreateModal?: boolean;
  selectMode?: boolean;
  selected?: boolean;
  coins?: number;
  isJoined?: boolean;
}

type RenderProgressBlockProps = {
  challengeType?: ChallengeType;
  progress?: number;
  hoursAmount?: number;
  dailyStreakProgress?: number[] | null;
  daysPassed?: number;
};

const RenderProgressBlock: React.FC<RenderProgressBlockProps> = React.memo(
  ({challengeType, progress, hoursAmount, dailyStreakProgress, daysPassed}) => {
    if (challengeType && challengeType !== "streak") {
      if (progress !== undefined && hoursAmount !== undefined) {
        return (
          <Text style={[common.whiteNormalBoldText]}>
            {formatProgressTime(progress)}{" "}
            <Text style={[common.grayNormalText, {fontWeight: 500}]}>
              / {formatProgressTime(hoursAmount * 3600)}
            </Text>
          </Text>
        );
      }
      return null;
    }

    if (challengeType === "streak") {
      if (dailyStreakProgress && daysPassed && hoursAmount) {
        return (
          <StreakCountBlock
            daysPassed={daysPassed}
            dailyStreakProgress={dailyStreakProgress}
            hoursAmount={hoursAmount}
          />
        );
      }
      return null;
    }

    return null;
  },
);

type RenderStatusBlockProps = {
  challengeCreateModal?: boolean;
  coins?: number;
  challengeStatus?: ChallengeStatus;
  status?: ParticipantStatus;
  selectMode?: boolean;
  selected?: boolean;
  isJoined?: boolean;
};

const RenderStatusBlock: React.FC<RenderStatusBlockProps> = React.memo(
  ({
    challengeCreateModal,
    coins,
    challengeStatus,
    status,
    selectMode,
    selected,
    isJoined = false,
  }) => {
    if ((challengeCreateModal && coins) || (coins && selectMode)) {
      return (
        <View style={{flexDirection: "row", alignItems: "center", gap: 7}}>
          <View style={{flexDirection: "row", alignItems: "center", gap: 7}}>
            <Coin width={16} height={16} />
            <Text style={[common.whiteNormalBoldText]}>{coins}</Text>
          </View>
          {selectMode && (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 100,
                borderWidth: 1,
                borderColor: "white",
                minWidth: 12,
                minHeight: 12,
              }}
            >
              {selected && <CircleCheck width={12} height={12} />}
            </View>
          )}
        </View>
      );
    }
    if (challengeStatus === "finished" && status) {
      return (
        <View
          style={[
            {paddingHorizontal: 4, paddingVertical: 4, borderRadius: 6},
            status === "failed"
              ? {backgroundColor: COLORS.red}
              : {backgroundColor: COLORS.lightGreen},
          ]}
        >
          <Text style={[common.whiteNormalBoldText, {fontWeight: 600}]}>
            {status === "failed" ? "Lost" : "Won"}
          </Text>
        </View>
      );
    }
    if (challengeStatus === "pending") {
      return (
        <View
          style={[
            localStyles.joinStatus,
            !isJoined ? {backgroundColor: COLORS.red} : undefined,
          ]}
        >
          <Text style={[common.whiteText, {fontSize: 13, fontWeight: 600}]}>
            {isJoined ? "Joined" : "Invited"}
          </Text>
        </View>
      );
    }
    return null;
  },
);

export const Participant: React.FC<ParticipantProps> = ({
  challengeType,
  challengeStatus,
  challengeCreateModal,
  username,
  gradientColors,
  progress,
  hoursAmount,
  status,
  selectMode,
  selected,
  dailyStreakProgress,
  daysPassed,
  coins,
  isJoined,
}) => {
  const progressPercentage =
    progress !== undefined && progress !== null && hoursAmount
      ? (progress * 100) / (hoursAmount * 3600)
      : null;

  return (
    <UIBlock style={{marginBottom: 0}}>
      <View style={localStyles.topRow}>
        <View style={localStyles.leftPart}>
          <UserAvatarCircle
            gradientColors={gradientColors}
            style={{width: 21, height: 21}}
          />
          <Text style={[common.whiteNormalBoldText, {fontWeight: 600}]}>
            {username}
          </Text>
        </View>
        <View style={localStyles.rightPart}>
          <RenderProgressBlock
            challengeType={challengeType}
            progress={progress}
            hoursAmount={hoursAmount}
            dailyStreakProgress={dailyStreakProgress}
            daysPassed={daysPassed}
          />
          <RenderStatusBlock
            challengeCreateModal={challengeCreateModal}
            coins={coins}
            challengeStatus={challengeStatus}
            status={status}
            selectMode={selectMode}
            selected={selected}
            isJoined={isJoined}
          />
        </View>
      </View>
      {(challengeStatus === "active" ||
        (challengeStatus === "finished" && challengeType === "streak")) && (
        <View style={{marginTop: 10}}>
          {challengeType !== "streak" ? (
            <>
              {challengeType && progressPercentage !== null && (
                <ChallengeCardProgressBar
                  progressPercentage={progressPercentage}
                  type={challengeType}
                />
              )}
            </>
          ) : (
            <>
              {dailyStreakProgress && hoursAmount && daysPassed && (
                <StreakProgressBars
                  hoursAmount={hoursAmount}
                  myDailyStreakProgress={dailyStreakProgress}
                  daysPassed={daysPassed}
                />
              )}
            </>
          )}
        </View>
      )}
    </UIBlock>
  );
};

const localStyles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftPart: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    flexShrink: 1,
  },
  rightPart: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  joinStatus: {
    padding: 4,
    backgroundColor: COLORS.lightGreen,
    borderRadius: 5,
  },
});
