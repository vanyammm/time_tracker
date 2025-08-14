import {StackScreenProps} from "@react-navigation/stack";
import {
  useGetChallengeByIdQuery,
  useGetChallengeParticipantsQuery,
  useMarkAsViewedMutation,
} from "../../store/api/apiSlice";
import {useUserStore} from "../../store/userStore";
import {ChallengeStackParamList} from "../../navigation/ChallengeNavigator";
import {
  ActivityIndicator,
  Alert,
  Button,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import {UIButton} from "../../components/UIButton/UIButton";
import {commonScreenStyles} from "../commonStyles";
import {styles} from "./styles";
import {CircleDots} from "../../assets/svg/CircleDots";
import {common} from "../../theme/commonStyles";
import {generateChallengeDescriptionString} from "../../utils/utils";
import {Coin} from "../../../assets/Coin";
import {Win} from "../../assets/svg/Win";
import {TwoFlags} from "../../assets/svg/TwoFlags";

type Props = StackScreenProps<ChallengeStackParamList, "ChallengeResult">;

export const ChallengeResultScreen: React.FC<Props> = ({navigation, route}) => {
  const {challengeId} = route.params;
  const currentUser = useUserStore((state) => state.user);
  const [markAsViewed, {isLoading}] = useMarkAsViewedMutation();

  const {data: challenge} = useGetChallengeByIdQuery(
    {
      challengeId: challengeId,
      userId: currentUser?.id,
    },
    {
      skip: !currentUser || !challengeId,
    },
  );

  const {data: participants} = useGetChallengeParticipantsQuery(challengeId, {
    skip: !challengeId,
  });

  const prizePool =
    participants && challenge ? participants.length * challenge.buyIn : 404;

  const handleAcknowlege = async () => {
    if (!currentUser) return;

    try {
      await markAsViewed({userId: currentUser.id, challengeId}).unwrap();
      navigation.replace("ChallengeDetails", {challengeId});
    } catch (e: any) {
      Alert.alert("error marking challenge as viewed");
      navigation.replace("ChallengeDetails", {challengeId});
    }
  };

  return (
    <SafeAreaView
      style={[commonScreenStyles.container, {alignItems: "center"}]}
    >
      <View style={[styles.header]}>
        <Button
          title="< Back"
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Pressable>
          <CircleDots width={27} height={27} />
        </Pressable>
      </View>
      <View style={{flex: 1, justifyContent: "center", width: "100%"}}>
        {challenge?.myStatus === "failed" && (
          <View style={{alignItems: "center"}}>
            <TwoFlags fill={"red"} width={130} height={130} />
            <Text style={[common.whiteText, {fontSize: 50, fontWeight: 800}]}>
              You lost
            </Text>
            <View style={{width: 300, marginBottom: 20}}>
              <Text
                style={[
                  common.grayBigBoldText,
                  {fontWeight: 600, textAlign: "center"},
                ]}
              >
                You did not{" "}
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
            <Text style={[common.grayBigBoldText, {marginBottom: 13}]}>
              You lose
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Coin width={30} height={30} />
              <Text style={[common.whiteHugeText, {fontWeight: 800}]}>
                {prizePool}
              </Text>
            </View>
          </View>
        )}
        {challenge?.myStatus === "completed" && (
          <View style={{alignItems: "center"}}>
            <Win width={130} height={130} />
            <Text style={[common.whiteText, {fontSize: 50, fontWeight: 800}]}>
              You Won!
            </Text>
            <View style={{width: 280, marginBottom: 40}}>
              <Text
                style={[
                  common.grayBigBoldText,
                  {fontWeight: 600, textAlign: "center"},
                ]}
              >
                {challenge.type === "race" ? "You won " : "You did"}
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
            <Text style={[common.grayBigBoldText, {fontWeight: 600}]}>
              You receive
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Coin width={30} height={30} />
              <Text style={[common.whiteHugeText, {fontWeight: 800}]}>
                {prizePool}
              </Text>
            </View>
          </View>
        )}
      </View>
      <UIButton
        style={{
          paddingHorizontal: 55,
          paddingVertical: 15,
          borderRadius: 18,
        }}
        onPress={handleAcknowlege}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text style={[common.whiteBigBoldText, {fontWeight: 600}]}>
            Continue
          </Text>
        )}
      </UIButton>
    </SafeAreaView>
  );
};
