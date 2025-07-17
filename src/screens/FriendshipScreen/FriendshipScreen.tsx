import {
  View,
  Text,
  Button,
  ScrollView,
  FlatList,
  TouchableHighlight,
} from "react-native";
import {commonScreenStyles} from "../commonStyles";
import {useEffect, useState} from "react";
import {ChallengeCreateModal} from "../../components/ChallengeCreateModal/ChallengeCreateModal";
import {styles} from "./styles";
import {common} from "../../theme/commonStyles";
import {UIBlock} from "../../components/UIBlock/UIBlock";
import {UIButton} from "../../components/UIButton/UIButton";
import {COLORS} from "../../theme/colors";
import {UserAvatarCircle} from "../../components/UserAvatarCircle/UserAvatarCircle";
import {FinishFlag} from "../../assets/svg/FinishFlag";
import {CircleDots} from "../../assets/svg/CircleDots";
import {CirclePlus} from "../../assets/svg/CirclePlus";
import {useUserStore} from "../../store/userStore";
import {
  useGetChallengesQuery,
  useTriggerStatusUpdateMutation,
} from "../../store/api/apiSlice";
import {ChallengeCard} from "../../components/ChallengeCard/ChallengeCard";
import {useIsFocused} from "@react-navigation/native";
import {FriendshipModal} from "../../components/FriendshipModal/FriendshipModal";

const top3leaderBoardMock = [
  {position: 2, usrId: 123, nickname: "Roman Pohribnyak", time: "13h 13m"},
  {position: 1, usrId: 233, nickname: "John Doe", time: "13h 20m"},
  {position: 3, usrId: 23, nickname: "Rage Krimson", time: "13h 4m"},
];

const top10leadearBoardMock = [
  {usrId: 954, nickname: "dima", time: "12h 55m"},
  {usrId: 873, nickname: "sofia", time: "11h 30m"},
  {usrId: 421, nickname: "oleksii", time: "10h 5m"},
  {usrId: 302, nickname: "marta", time: "8h 40m"},
  {usrId: 667, nickname: "andrii", time: "7h 20m"},
  {usrId: 108, nickname: "ira", time: "6h 10m"},
  {usrId: 215, nickname: "vlad", time: "5h 45m"},
];

const today = new Date();
const pozavchora = new Date(today);
pozavchora.setDate(today.getDate() - 1);

export const FriendshipScreen = () => {
  const [challengeModalShown, setChallengeModalShown] = useState(false);
  const [friendshipModalShown, setFriendshipModalShown] = useState(false);
  // const {user} = useUserStore();

  const isFocused = useIsFocused();
  const [triggerUpdate] = useTriggerStatusUpdateMutation();

  useEffect(() => {
    console.log("[FrineshipScreen] triggering challenges status check.");
    if (isFocused) triggerUpdate();
  }, [isFocused]);

  const user = useUserStore((state) => state.user);

  // console.log("[FriendshipScreen] user:", user);

  const {
    data: challenges,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetChallengesQuery(user!.id, {
    skip: !user,
  });

  // console.log("challenges", challenges);

  const handleOpenChallengeCreateModal = () => {
    setChallengeModalShown((prev) => !prev);
  };

  const handleOpenFriendshipModal = () => {
    setFriendshipModalShown((prev) => !prev);
  };

  return (
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
        <CircleDots width={30} height={30} />
      </View>

      <View>
        {/* <ChallengeCard
          challenge={{
            type: "regular",
            daysAmount: 7,
            hoursAmount: 40,
            action: "Focus",
            challengeStatus: "completed",
            startDate: pozavchora,
            // progress: 7.4 * 60 * 60,
          }}
        /> */}
      </View>
      <FlatList
        data={challenges}
        scrollEnabled={false}
        renderItem={({item}) => <ChallengeCard challenge={item} />}
      />
      <UIBlock>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <Text
            style={[styles.currentChallengeBlockHeader, common.normalSizeText]}
          >
            Focus for 40 hours in 7 days
          </Text>
          <FinishFlag width={20} height={20} />
        </View>
        <Text style={[common.whiteNormalText, styles.currentChallengeStatus]}>
          Challenge is over
        </Text>
        <UIButton>View Result</UIButton>
      </UIBlock>
      <View style={[styles.socialHeader]}>
        <Text style={[common.whiteNormalBoldText, styles.socialHeaderText]}>
          Social
        </Text>
        <TouchableHighlight onPress={handleOpenFriendshipModal}>
          <CirclePlus width={30} height={30} />
        </TouchableHighlight>
      </View>
      <View style={[styles.socialList]}>
        <View style={[styles.socialListItemWrapper]}>
          {/* <View style={[styles.socialListItem]}></View> */}
          <UserAvatarCircle gradientColors={user!.avatarGradient} />
          <Text style={[common.whiteNormalText]}>{user!.username}</Text>
        </View>
        <View style={[styles.socialListItemWrapper]}>
          <View style={[styles.socialListItem]}></View>
          <Text style={[common.whiteNormalText]}>Vanya M...</Text>
        </View>
      </View>
      <FlatList
        data={[1]}
        horizontal={true}
        renderItem={() => (
          <View style={[styles.socialListItemWrapper]}>
            <View style={[styles.socialListItem]}></View>
            <Text style={[common.whiteNormalText]}>Vanya M...</Text>
          </View>
        )}
      />
      <UIBlock>
        <View style={[styles.leaderBoardHeader]}>
          <Text style={[common.whiteNormalBoldText, {fontSize: 20}]}>
            Leaderboard
          </Text>
          <View style={[styles.leaderBoardHeaderButtons]}>
            <Text style={[common.whiteNormalBoldText]}>Global</Text>
            <Text style={[common.whiteNormalBoldText]}>Friends</Text>
          </View>
        </View>
        <View style={[styles.leaderBoardNavigation]}>
          <UIButton
            style={[
              styles.leaderBoardNavigationButton,
              {backgroundColor: COLORS.dark},
            ]}
          >
            Daily
          </UIButton>
          <UIButton
            style={[
              styles.leaderBoardNavigationButton,
              {backgroundColor: COLORS.dark},
            ]}
          >
            Weekly
          </UIButton>
        </View>
        <View style={[styles.leaderBoardTopThree]}>
          {top3leaderBoardMock.map((i) => {
            const avatarSize = i.position === 1 ? 90 : 70;
            return (
              <View
                key={i.usrId}
                style={[
                  styles.leaderBoardTopThreeItem,
                  {width: avatarSize},
                  i.position === 1 && {marginBottom: 10},
                ]}
              >
                <UserAvatarCircle
                  style={[
                    i.position === 1 && {width: avatarSize, height: avatarSize},
                    {marginBottom: 8},
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 40,
                      fontWeight: 900,
                      color: "white",
                      textShadowColor: "rgba(255, 255, 255, 0.8)",
                      textShadowOffset: {width: 0, height: 0},
                      textShadowRadius: 6,
                    }}
                  >
                    {i.position}
                  </Text>
                </UserAvatarCircle>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    common.whiteNormalText,
                    {
                      maxWidth: avatarSize - 10,
                      textAlign: "center",
                      textShadowColor: "rgba(255, 255, 255, 0.8)",
                      textShadowOffset: {width: 0, height: 0},
                      textShadowRadius: 10,
                    },
                  ]}
                >
                  {i.nickname}
                </Text>
                <Text
                  style={[common.normalSizeText, {color: COLORS.lightGray}]}
                >
                  {i.time}
                </Text>
              </View>
            );
          })}
        </View>
        <View>
          {top10leadearBoardMock.map((item, index) => {
            return (
              <View key={item.usrId}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                  }}
                >
                  <View
                    style={{flexDirection: "row", gap: 7, alignItems: "center"}}
                  >
                    <View style={{width: 25, alignItems: "flex-start"}}>
                      <Text style={[common.whiteNormalText]}>{index + 4}.</Text>
                    </View>
                    <UserAvatarCircle style={{width: 23, height: 23}} />
                    <Text style={[common.whiteNormalText]}>
                      {item.nickname}
                    </Text>
                  </View>
                  <Text
                    style={[common.whiteNormalText, {color: COLORS.lightGray}]}
                  >
                    {item.time}
                  </Text>
                </View>
                {index !== top10leadearBoardMock.length - 1 && (
                  <View style={{height: 0.5, backgroundColor: "gray"}}></View>
                )}
              </View>
            );
          })}
        </View>
      </UIBlock>
      <Button title="New challenge" onPress={handleOpenChallengeCreateModal} />
      {challengeModalShown && (
        <ChallengeCreateModal
          visible={challengeModalShown}
          setVisible={setChallengeModalShown}
        />
      )}
      {user && friendshipModalShown && (
        <FriendshipModal
          user={user}
          visible={friendshipModalShown}
          setVisible={setFriendshipModalShown}
        />
      )}
    </ScrollView>
  );
};
