import {View, Text} from "react-native";
import {styles} from "./styles";
import {common} from "../../theme/commonStyles";
import {UserAvatarCircle} from "../UserAvatarCircle/UserAvatarCircle";
import {ChallengeParticipantDetails} from "../../../db/schema";
import {formatProgressTime} from "../../utils/utils";

interface ChallengeParticipantsProps {
  type: "regular" | "streak" | "race" | "team";
  participants: Array<ChallengeParticipantDetails>;
}

export const ChallengeParticipants: React.FC<ChallengeParticipantsProps> = ({
  type,
  participants,
}) => {
  return (
    <View>
      {participants.length > 1
        ? participants.map((participant, index) => (
            <View key={index} style={[styles.challengeParticipant]}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 33,
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={[common.grayNormalSemiboldText]}>
                    {index + 1}.
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <UserAvatarCircle
                    gradientColors={participant.avatarGradient}
                    style={{width: 17, height: 17}}
                  />
                  <Text style={[common.whiteNormalText]}>
                    {participant.username}
                  </Text>
                </View>
              </View>
              <Text style={[common.grayNormalText]}>
                {formatProgressTime(participant.progress)}
              </Text>
            </View>
          ))
        : null}
    </View>
  );
};
