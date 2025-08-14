import React from "react";
import {ChallengeWithMyDetails} from "../../../db/schema";
import {UIBlock} from "../UIBlock/UIBlock";
import {StyleSheet, Text, View} from "react-native";
import {
  formatDate,
  generateChallengeDescriptionString,
} from "../../utils/utils";
import {common} from "../../theme/commonStyles";
import {TwoFlags} from "../../assets/svg/TwoFlags";
import {Win} from "../../assets/svg/Win";
import {useGetUserByIdQuery} from "../../store/api/apiSlice";

interface ArchivedChallengeCardProps {
  challenge: ChallengeWithMyDetails;
}

export const ArchivedChallengeCard: React.FC<ArchivedChallengeCardProps> = ({
  challenge,
}) => {
  const {data: host} = useGetUserByIdQuery(challenge.hostId);

  return (
    <UIBlock>
      <View style={localStyles.top}>
        <View style={{gap: 10, flex: 1}}>
          <View style={{width: "90%"}}>
            <Text style={[common.whiteNormalBoldText]}>
              {generateChallengeDescriptionString({
                action: challenge.action,
                type: challenge.type,
                hoursAmount: challenge.hoursAmount,
                daysAmount: challenge.daysAmount
                  ? challenge.daysAmount
                  : undefined,
              })}
            </Text>
          </View>
          <Text style={[common.whiteBigBoldText]}>
            {challenge.myStatus === "completed"
              ? "Challenge Won"
              : "Challenge Lost"}
          </Text>
        </View>
        <View>
          {challenge.myStatus === "completed" ? (
            <Win width={50} height={50} />
          ) : (
            <TwoFlags width={50} height={50} fill={"red"} />
          )}
        </View>
      </View>
      <View style={localStyles.bottom}>
        <View>
          <Text style={[common.grayNormalText]}>Started</Text>
          <Text style={[common.whiteNormalBoldText]}>
            {formatDate(challenge.startDate)}
          </Text>
        </View>
        <View>
          <Text style={[common.grayNormalText]}>Ended</Text>
          <Text style={[common.whiteNormalBoldText]}>
            {formatDate(challenge.endDate!)}
          </Text>
        </View>
        <View>
          <Text style={[common.grayNormalText]}>Host</Text>
          <Text style={[common.whiteNormalBoldText]}>
            {host ? `${host.username}` : "404"}
          </Text>
        </View>
      </View>
    </UIBlock>
  );
};

const localStyles = StyleSheet.create({
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
