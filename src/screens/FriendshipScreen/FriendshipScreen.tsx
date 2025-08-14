import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
} from "react-native";
import {commonScreenStyles} from "../commonStyles";
import {useEffect, useMemo, useState} from "react";
import {styles} from "./styles";
import {common} from "../../theme/commonStyles";
import {UserAvatarCircle} from "../../components/UserAvatarCircle/UserAvatarCircle";
import {CircleDots} from "../../assets/svg/CircleDots";
import {CirclePlus} from "../../assets/svg/CirclePlus";
import {useUserStore} from "../../store/userStore";
import {
  useGetChallengeInvitesQuery,
  useGetFeedChallengesQuery,
  useGetFriendsQuery,
  useGetPendingFriendRequestsQuery,
  useHandleFriendRequestMutation,
  useTriggerStatusUpdateMutation,
} from "../../store/api/apiSlice";
import {ChallengeCard} from "../../components/ChallengeCard/ChallengeCard";
import {RouteProp, useIsFocused, useRoute} from "@react-navigation/native";
import {FriendshipModal} from "../../components/FriendshipModal/FriendshipModal";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {ChallengeStackParamList} from "../../navigation/ChallengeNavigator";

import {MainTabParamList, RootStackParamList} from "../../navigation/types";
import {Leaderboard} from "../../components/Leaderboard/Leaderboard";
import {UserCard} from "../../components/FriendshipModal/UserCard";
import {MenuItem, OptionsMenu} from "../../components/OptionsMenu/OptionsMenu";
import {ChallengeInviteCard} from "../../components/ChallengeCard/ChallengeInviteCard";

type FriendshipNavigationProp = StackNavigationProp<RootStackParamList>;
type FriendshipScreenRouteProp = RouteProp<MainTabParamList, "Friendship">;

const today = new Date();
const pozavchora = new Date(today);
pozavchora.setDate(today.getDate() - 1);

export const FriendshipScreen = () => {
  const navigation = useNavigation<FriendshipNavigationProp>();
  const route = useRoute<FriendshipScreenRouteProp>();

  const selectedFriendsFromNav = route.params?.selectedFriends;

  const [challengeModalShown, setChallengeModalShown] = useState(false);
  const [friendshipModalShown, setFriendshipModalShown] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);

  const isFocused = useIsFocused();
  const [triggerUpdate] = useTriggerStatusUpdateMutation();

  useEffect(() => {
    console.log("[FrineshipScreen] triggering challenges status check.");
    if (isFocused) triggerUpdate();
  }, [isFocused]);

  const user = useUserStore((state) => state.user);

  const {data: pendingFriendRequests} = useGetPendingFriendRequestsQuery(
    {
      userId: user?.id,
      direction: "incoming",
    },
    {
      skip: !user,
    },
  );

  const {
    data: challenges,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetFeedChallengesQuery(user?.id, {
    skip: !user,
  });

  const {data: friends} = useGetFriendsQuery(user?.id, {
    skip: !user,
  });

  const {
    data: challengeInvites,
    isLoading: isLoadingChallengeInvites,
    isError: isErrorChallengeInvites,
    error,
  } = useGetChallengeInvitesQuery(user?.id, {
    skip: !user,
  });

  const [
    handleFriendRequest,
    {isLoading: isHandlingFriendRequest, originalArgs},
  ] = useHandleFriendRequestMutation();

  const handleFriendRequestAccept = async (senderId: number) => {
    if (!user) return;

    try {
      await handleFriendRequest({
        senderId,
        receiverId: user.id,
        action: "accept",
      }).unwrap();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleFriendRequestDecline = async (senderId: number) => {
    if (!user) return;

    try {
      await handleFriendRequest({
        senderId,
        receiverId: user.id,
        action: "decline",
      }).unwrap();
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  const handleOpenChallengeCreateModal = () => {
    navigation.navigate("ChallengeCreation", {
      screen: "ChallengeCreateModal",
      params: {onboarding: false},
    });
  };

  const handleOpenFriendshipModal = () => {
    setFriendshipModalShown((prev) => !prev);
  };

  const handleChallengePress = (
    id: number,
    status: "pending" | "active" | "finished",
    isResultViewed: boolean,
  ) => {
    console.log("going to challengeDetail page, challenge id", id);
    if (status === "finished" && !isResultViewed) {
      navigation.navigate("ChallengeResult", {challengeId: id});
    } else {
      navigation.navigate("ChallengeDetails", {challengeId: id});
    }
  };

  const handleOpenChallengeArchive = () => {
    navigation.navigate("ChallengeArchive");
  };

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        id: "create",
        label: "Create Challenge",
        onPress: handleOpenChallengeCreateModal,
      },
      {
        id: "past",
        label: "Past Challenges",
        onPress: handleOpenChallengeArchive,
      },
    ],
    [],
  );

  return (
    <SafeAreaView style={commonScreenStyles.container}>
      <ScrollView style={[commonScreenStyles.container, styles.activityScreen]}>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <Text
            style={[
              commonScreenStyles.text,
              common.whiteNormalBoldText,
              styles.activityScreenHeader,
            ]}
          >
            Challenges
          </Text>
          <View>
            <Pressable onPress={() => setMenuVisible((v) => !v)}>
              <CircleDots width={30} height={30} />
            </Pressable>
            {isMenuVisible && (
              <OptionsMenu
                items={menuItems}
                onClose={() => setMenuVisible(false)}
                style={{position: "absolute", top: 40, right: 0, zIndex: 10}}
              />
            )}
          </View>
        </View>
        {challengeInvites && challengeInvites.length > 0 && (
          <View>
            <Text style={[common.grayBigBoldText, {marginBottom: 15}]}>
              Challenge Invites
            </Text>
            <FlatList
              data={challengeInvites}
              keyExtractor={(item) => item.challengeId.toString()}
              renderItem={({item}) => <ChallengeInviteCard invite={item} />}
            />
          </View>
        )}
        <FlatList
          data={challenges}
          scrollEnabled={false}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                handleChallengePress(item.id, item.status, item.isResultViewed)
              }
              activeOpacity={1}
            >
              <ChallengeCard challenge={item} />
            </TouchableOpacity>
          )}
        />
        <View style={[styles.socialHeader]}>
          <Text style={[common.whiteNormalBoldText, styles.socialHeaderText]}>
            Social
          </Text>
          <TouchableHighlight onPress={handleOpenFriendshipModal}>
            <CirclePlus width={30} height={30} />
          </TouchableHighlight>
        </View>
        {user && friends && (
          <FlatList
            style={{marginBottom: 20}}
            data={[user, ...(friends || [])]}
            horizontal={true}
            renderItem={({item}) => (
              <View style={[styles.socialListItemWrapper]}>
                <UserAvatarCircle gradientColors={item.avatarGradient ?? []} />
                <Text style={[common.whiteNormalText]}>{item.username}</Text>
              </View>
            )}
          />
        )}
        {pendingFriendRequests && pendingFriendRequests.length > 0 && (
          <View>
            <Text style={[common.whiteNormalText, {fontWeight: 600}]}>
              Friend Requests
            </Text>
            {pendingFriendRequests.map((request) => {
              const isAcceptingCurrent =
                isLoading &&
                originalArgs?.senderId === request.id &&
                originalArgs?.action === "accept";
              const isDecliningCurrent =
                isLoading &&
                originalArgs?.senderId === request.id &&
                originalArgs?.action === "decline";

              return (
                <UserCard
                  user={request}
                  key={request.id}
                  type="pending_invite"
                  onAccept={handleFriendRequestAccept}
                  onDecline={handleFriendRequestDecline}
                  isAccepting={isAcceptingCurrent}
                  isDeclining={isDecliningCurrent}
                />
              );
            })}
          </View>
        )}
        <Leaderboard />
        {user && friendshipModalShown && (
          <FriendshipModal
            user={user}
            visible={friendshipModalShown}
            setVisible={setFriendshipModalShown}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
