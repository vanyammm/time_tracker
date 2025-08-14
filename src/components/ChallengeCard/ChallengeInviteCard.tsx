import React from "react";
import {UIBlock} from "../UIBlock/UIBlock";
import {Text, View} from "react-native";
import {common} from "../../theme/commonStyles";
import {
  ChallengeInviteForState,
  generateChallengeDescriptionString,
} from "../../utils/utils";
import {UIButton} from "../UIButton/UIButton";
import {COLORS} from "../../theme/colors";
import {useHandleChallengeInviteMutation} from "../../store/api/apiSlice";
import {useUserStore} from "../../store/userStore";
import {ChallengeInviteInfoBlock} from "./ChallengeInviteInfoBlock";

interface Props {
  invite: ChallengeInviteForState;
}

export const ChallengeInviteCard: React.FC<Props> = ({invite}) => {
  const {
    challengeId,
    challengeAction,
    challengeDaysAmount,
    challengeHoursAmount,
    challengeType,
    senderId,
    senderUsername,
    buyIn,
    startDate,
  } = invite;

  const currentUser = useUserStore((state) => state.user);
  const [handleChallengeInvite] = useHandleChallengeInviteMutation();

  const handleDecline = async () => {
    if (!currentUser) return;
    try {
      await handleChallengeInvite({
        action: "decline",
        challengeId,
        receiverId: currentUser.id,
      }).unwrap();
    } catch (error: any) {
      console.error(`error declining challenge invite: ${error}`);
    }
  };

  const handleAccept = async () => {
    if (!currentUser) return;
    try {
      await handleChallengeInvite({
        action: "accept",
        challengeId,
        receiverId: currentUser.id,
      }).unwrap();
    } catch (error: any) {
      console.error(`error accepting challenge invite: ${error}`);
    }
  };

  return (
    <UIBlock>
      <ChallengeInviteInfoBlock
        buyIn={buyIn}
        hostUsername={senderUsername}
        startDate={startDate}
      />
      <Text style={[common.whiteNormalText]}>
        <Text style={{fontWeight: 700}}>{senderUsername} </Text>
        invites you to{" "}
        {generateChallengeDescriptionString({
          action: challengeAction,
          type: challengeType,
          hoursAmount: challengeHoursAmount,
          daysAmount: challengeDaysAmount ? challengeDaysAmount : undefined,
        })}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          gap: 9,
        }}
      >
        <UIButton
          style={{backgroundColor: COLORS.red, flex: 1}}
          onPress={handleDecline}
        >
          Decline
        </UIButton>
        <UIButton style={{flex: 1}} onPress={handleAccept}>
          Accept
        </UIButton>
      </View>
    </UIBlock>
  );
};
