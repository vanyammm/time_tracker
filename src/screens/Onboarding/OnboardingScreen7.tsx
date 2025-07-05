import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet} from "react-native";
import {common} from "../../theme/commonStyles";
import {styles} from "./styles";
import {ChallengeCreateModal} from "../../components/ChallengeCreateModal/ChallengeCreateModal";
import {useOnboardingData} from "../../context/OnboardingContext";
import {UIBlock} from "../../components/UIBlock/UIBlock";
import {Coin} from "../../../assets/Coin";
import {generateChallengeDescriptionString} from "../../utils/utils";
import {ChallengeConfiguration} from "../../components/ChallengeCreateModal/ChallengeConfiguration";
import {challengeTypes} from "../../components/ChallengeCreateModal/ChallengeTypeButtons";
import {useGetChallengeByIdQuery} from "../../store/api/apiSlice";

export const OnboardingScreen7 = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {createdChallengeId} = useOnboardingData();

  const {
    data: challenge,
    isLoading,
    isSuccess,
  } = useGetChallengeByIdQuery(createdChallengeId!, {
    skip: !createdChallengeId,
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsModalVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.onBoardingScreen]}>
      {isSuccess && challenge && (
        <View style={{width: "93%"}}>
          <View style={{marginBottom: 20}}>
            <Text style={[styles.screenHeaderText]}>Challenge created!</Text>
          </View>
          <View>
            <UIBlock>
              <View style={[localStyles.challengeBlockHeader]}>
                <View>
                  <Text style={[styles.screenSecondaryText, {fontSize: 15}]}>
                    Buy-In
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={[common.whiteNormalBoldText]}>
                      {challenge.buyIn + " "}
                    </Text>
                    <Coin />
                  </View>
                </View>
                <View>
                  <Text style={[styles.screenSecondaryText, {fontSize: 15}]}>
                    Starts
                  </Text>
                  <Text style={[common.whiteNormalBoldText]}>
                    {new Date(challenge.startDate).toLocaleDateString()}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.screenSecondaryText, {fontSize: 15}]}>
                    Host
                  </Text>
                  <Text style={[common.whiteNormalBoldText]}>Vanya Moroz</Text>
                </View>
              </View>
              <View>
                <ChallengeConfiguration
                  challengeCard
                  activeIndex={challengeTypes.indexOf(
                    (challenge.type.charAt(0).toUpperCase() +
                      challenge.type.slice(1)) as any,
                  )}
                  focusTitleData={challenge.action}
                  hoursAmountData={String(challenge.hoursAmount)}
                  daysAmountData={
                    challenge.daysAmount !== null &&
                    challenge.daysAmount !== undefined
                      ? String(challenge.daysAmount)
                      : undefined
                  }
                />
              </View>
            </UIBlock>
          </View>
        </View>
      )}
      <ChallengeCreateModal
        visible={isModalVisible}
        setVisible={setIsModalVisible}
        onboarding
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  challengeBlockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
