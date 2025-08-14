import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet} from "react-native";
import {common} from "../../theme/commonStyles";
import {styles} from "./styles";
import {UIBlock} from "../../components/UIBlock/UIBlock";
import {Coin} from "../../../assets/Coin";
import {
  formatDate,
  generateChallengeDescriptionString,
} from "../../utils/utils";
import {ChallengeConfiguration} from "../../components/ChallengeCreateModal/ChallengeConfiguration";
import {challengeTypes} from "../../components/ChallengeCreateModal/ChallengeTypeButtons";
import {
  useGetChallengeByIdQuery,
  useGetUserByIdQuery,
} from "../../store/api/apiSlice";
import {useOnboardingState} from "../../store/onboardingStore";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../navigation/types";
import {useNavigation} from "@react-navigation/native";
import {useUserStore} from "../../store/userStore";

type Screen7NavigationProp = StackNavigationProp<RootStackParamList>;

export const OnboardingScreen7 = () => {
  const navigation = useNavigation<Screen7NavigationProp>();
  const {createdChallengeId} = useOnboardingState();

  const {
    data: challenge,
    isLoading,
    isSuccess,
  } = useGetChallengeByIdQuery(
    {
      challengeId: createdChallengeId!,
      userId: useUserStore.getState().user!.id,
    },
    {
      skip: !createdChallengeId,
    },
  );

  const {data: challengeHost} = useGetUserByIdQuery(challenge?.hostId, {
    skip: !challenge,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("ChallengeCreation", {
        screen: "ChallengeCreateModal",
        params: {onboarding: true},
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [navigation]);

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
                    <Text
                      style={[common.whiteNormalBoldText, {fontWeight: 600}]}
                    >
                      {challenge.buyIn + " "}
                    </Text>
                    <Coin />
                  </View>
                </View>
                <View>
                  <Text style={[styles.screenSecondaryText, {fontSize: 15}]}>
                    Starts
                  </Text>
                  <Text style={[common.whiteNormalBoldText, {fontWeight: 600}]}>
                    {formatDate(challenge.startDate)}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.screenSecondaryText, {fontSize: 15}]}>
                    Host
                  </Text>
                  <Text style={[common.whiteNormalBoldText, {fontWeight: 600}]}>
                    {challengeHost?.username}
                  </Text>
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
    </View>
  );
};

const localStyles = StyleSheet.create({
  challengeBlockHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
