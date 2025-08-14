import React, {useMemo, useState} from "react";
import {
  View,
  Text,
  Button,
  SafeAreaView,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  useDeleteChallengeMutation,
  useGetChallengeByIdQuery,
  useGetChallengeParticipantsQuery,
  useGetChallengePendingStatusQuery,
} from "../../store/api/apiSlice";
import {CircleDots} from "../../assets/svg/CircleDots";
import {styles} from "./styles";
import {ChallengeStatusBlock} from "./ChallengeStatusBlock";
import {useUserStore} from "../../store/userStore";
import {
  calculateDaysPassed,
  calculateTimeBeforeStart,
  formatDate,
  formatProgressTime,
  generateChallengeDescriptionString,
  getCurrentFormattedDate,
} from "../../utils/utils";
import {common} from "../../theme/commonStyles";
import {PrizePoolBlock} from "./PrizePoolBlock";
import {COLORS} from "../../theme/colors";
import {Participant} from "./Participant";
import {MenuItem, OptionsMenu} from "../../components/OptionsMenu/OptionsMenu";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../navigation/types";

type ChallengeDetailsNavigationProp = StackNavigationProp<RootStackParamList>;

export const ChallengeDetailsScreen: React.FC<any> = ({navigation, route}) => {
  const {challengeId} = route.params;
  const currentUser = useUserStore((state) => state.user);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const [deleteChallenge] = useDeleteChallengeMutation();

  const handleChallengeDelete = async () => {
    if (!currentUser) return;

    Alert.alert(
      "Delete Challenge",
      "Are you sure you want to delete this challenge? This action cannot be undone.",
      [
        {text: "Cancel", style: "cancel"},
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteChallenge({
                challengeId: challengeId,
                hostId: currentUser.id,
              }).unwrap();

              Alert.alert("Success", "Challenge has been deleted.");
              navigation.goBack();
            } catch (error: any) {
              Alert.alert(
                "Error",
                error.message || "Could not delete the challenge.",
              );
            }
          },
        },
      ],
    );
  };

  const {
    data: challenge,
    isLoading,
    isError,
    error,
  } = useGetChallengeByIdQuery(
    {
      challengeId: challengeId,
      userId: currentUser?.id,
    },
    {
      skip: !currentUser,
    },
  );

  const menuItems: MenuItem[] = useMemo(() => {
    const items: MenuItem[] = [
      {
        id: "invite",
        label: "Invite Friends",
        onPress: () => {
          Alert.alert("Coming soon", "шучу яке камінг сун, не буде такого");
        },
      },
    ];
    if (challenge && currentUser && challenge.hostId === currentUser.id) {
      items.push({
        id: "delete",
        label: "Delete Challenge",
        onPress: handleChallengeDelete,
        isDestructive: true,
      });
    }
    return items;
  }, [challenge, currentUser]);

  const daysPassed = challenge
    ? calculateDaysPassed(challenge.startDate)
    : null;

  const {data: participants} = useGetChallengeParticipantsQuery(challengeId, {
    skip: challenge?.status !== "active" && challenge?.status !== "finished",
  });

  const {data: pendingStatus} = useGetChallengePendingStatusQuery(challengeId, {
    skip: challenge?.status !== "pending",
  });

  const timeBeforeStart = challenge
    ? calculateTimeBeforeStart(challenge.startDate, challenge.status)
    : null;

  let participantsCount: number | null = null;

  if (challenge?.status === "pending" && pendingStatus) {
    participantsCount = pendingStatus.filter(
      (p) => p.status === "participant",
    ).length;
  } else if (participants) {
    participantsCount = participants.length;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header]}>
        <Button
          title="< Back"
          color="white"
          onPress={() => navigation.goBack()}
        />
        <View>
          <Pressable onPress={() => setIsMenuVisible(true)}>
            <CircleDots width={27} height={27} />
          </Pressable>
          {isMenuVisible && (
            <OptionsMenu
              items={menuItems}
              onClose={() => setIsMenuVisible(false)}
              style={{position: "absolute", top: 40, right: 0, zIndex: 10}}
            />
          )}
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.content}>
          {challenge && (
            <>
              <ChallengeStatusBlock challenge={challenge} />
              <View style={{width: "100%"}}>
                {challenge.status === "pending" && (
                  <View
                    style={{
                      width: "100%",
                      alignItems: "center",
                      marginBottom: 15,
                    }}
                  >
                    <View style={[styles.daysPassedBlock]}>
                      <Text
                        style={[
                          common.whiteBigBoldText,
                          {color: COLORS.modalBg},
                        ]}
                      >
                        Not Started
                      </Text>
                    </View>
                  </View>
                )}
                <Text
                  style={[
                    common.grayBigBoldText,
                    {fontWeight: 800, marginBottom: 7, textAlign: "center"},
                    challenge.status === "active" ||
                    challenge.status === "pending"
                      ? {fontSize: 30, color: "white"}
                      : undefined,
                  ]}
                >
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
              <Text style={[common.grayNormalText, {marginBottom: 16}]}>
                {formatDate(challenge.startDate)} -{" "}
                {challenge.endDate
                  ? formatDate(challenge.endDate)
                  : getCurrentFormattedDate()}
              </Text>
              {challenge.status === "pending" && timeBeforeStart && (
                <Text style={[common.whiteBigBoldText, {marginBottom: 15}]}>
                  Starts in {formatProgressTime(timeBeforeStart, "detailed")}
                </Text>
              )}
              {participantsCount ? (
                <PrizePoolBlock
                  buyIn={challenge.buyIn}
                  participants={participantsCount}
                />
              ) : (
                <ActivityIndicator />
              )}
              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.gray,
                  marginBottom: 20,
                }}
              />
            </>
          )}
        </View>
        {challenge?.status === "pending" && pendingStatus && (
          <FlatList
            data={pendingStatus}
            renderItem={({item}) => (
              <View style={styles.participantWrapper}>
                <Participant
                  username={item.username}
                  gradientColors={item.avatarGradient}
                  isJoined={item.status === "participant"}
                  challengeStatus={challenge.status}
                />
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{height: 5}} />}
          />
        )}
        {participants && challenge && (
          <FlatList
            data={participants}
            renderItem={({item}) => (
              <View style={styles.participantWrapper}>
                <Participant
                  challengeType={challenge.type}
                  challengeStatus={challenge.status}
                  username={item.username}
                  gradientColors={item.avatarGradient}
                  progress={item.progress}
                  hoursAmount={challenge.hoursAmount}
                  status={item.status}
                  daysPassed={daysPassed}
                  dailyStreakProgress={item.dailyStreakProgress}
                />
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{height: 5}} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
