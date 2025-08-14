import {Pressable, Text, View} from "react-native";
import {UIBlock} from "../UIBlock/UIBlock";
import {common} from "../../theme/commonStyles";
import {COLORS} from "../../theme/colors";
import {UserAvatarCircle} from "../UserAvatarCircle/UserAvatarCircle";
import {styles} from "./styles";
import {useUserStore} from "../../store/userStore";
import {useMemo, useState} from "react";
import {LeaderboardFilter, LeaderboardPeriod} from "../../services/authService";
import {useGetLeaderboardQuery} from "../../store/api/apiSlice";
import {AnimatedSegmentedControl} from "./AnimatedSegmentedControl";
import {LeaderboardEntry} from "../../../db/schema";
import {formatProgressTime} from "../../utils/utils";

export const Leaderboard = () => {
  const currentUser = useUserStore((state) => state.user);

  const [filter, setFilter] = useState<LeaderboardFilter>("global");
  const [period, setPeriod] = useState<LeaderboardPeriod>("daily");

  const {
    data: leaderboard,
    isLoading,
    isFetching,
  } = useGetLeaderboardQuery(
    {
      currentUserId: currentUser?.id,
      filter: filter,
      period: period,
    },
    {
      skip: !currentUser,
    },
  );

  const {top3, others} = useMemo(() => {
    if (!leaderboard || !leaderboard.top10) {
      return {top3: [], others: []};
    }

    const top10 = leaderboard.top10;

    const createMockEntry = (rank: number): LeaderboardEntry => ({
      rank,
      userId: -rank,
      username: "Empty",
      avatarGradient: ["#333", "#555"],
      progress: 0,
    });

    const rank1 = top10.find((user) => user.rank === 1) || createMockEntry(1);
    const rank2 = top10.find((user) => user.rank === 2) || createMockEntry(2);
    const rank3 = top10.find((user) => user.rank === 3) || createMockEntry(3);

    const top3Podium = [rank2, rank1, rank3];

    const restOfTop10 = top10.slice(3);

    if (leaderboard.currentUser) {
      restOfTop10.push(leaderboard.currentUser);
    }

    return {top3: top3Podium, others: restOfTop10};
  }, [leaderboard]);

  const handleFilterSelect = (selectedFilter: LeaderboardFilter) => {
    setFilter(selectedFilter);
  };

  const handlePeriodSelect = (selectedPeriod: LeaderboardPeriod) => {
    setPeriod(selectedPeriod);
  };

  return (
    <UIBlock>
      <View style={[styles.leaderBoardHeader]}>
        <Text style={[common.whiteNormalBoldText, {fontSize: 20}]}>
          Leaderboard
        </Text>
        <View style={[styles.leaderBoardHeaderButtons]}>
          <Pressable onPress={() => setFilter("global")}>
            <Text
              style={[
                common.whiteNormalText,
                {fontWeight: 600},
                filter === "global" ? undefined : {color: COLORS.lightGray},
              ]}
            >
              Global
            </Text>
          </Pressable>
          <Pressable onPress={() => setFilter("friends")}>
            <Text
              style={[
                common.whiteNormalText,
                {fontWeight: 600},
                filter === "friends" ? undefined : {color: COLORS.lightGray},
              ]}
            >
              Friends
            </Text>
          </Pressable>
        </View>
      </View>
      <View style={[styles.leaderBoardNavigation]}>
        <AnimatedSegmentedControl
          options={["daily", "weekly"]}
          onSelect={(option) => handlePeriodSelect(option as LeaderboardPeriod)}
          style={{width: "100%", height: 40}}
        />
      </View>
      <View style={[styles.leaderBoardTopThree]}>
        {top3.map((item) => {
          const avatarSize = item.rank === 1 ? 90 : 70;
          return (
            <View
              key={item.rank}
              style={[
                styles.leaderBoardTopThreeItem,
                {width: avatarSize},
                item.rank === 1 && {marginBottom: 10},
              ]}
            >
              <UserAvatarCircle
                gradientColors={item.avatarGradient}
                style={[
                  item.rank === 1 && {width: avatarSize, height: avatarSize},
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
                  {item.rank}
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
                {item.username}
              </Text>
              <Text style={[common.normalSizeText, {color: COLORS.lightGray}]}>
                {formatProgressTime(item.progress)}
              </Text>
            </View>
          );
        })}
      </View>
      <View>
        {others.map((item, index) => {
          return (
            <View key={item.rank}>
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
                  <UserAvatarCircle
                    style={{width: 23, height: 23}}
                    gradientColors={item.avatarGradient}
                  />
                  <Text style={[common.whiteNormalText]}>{item.username}</Text>
                </View>
                <Text
                  style={[common.whiteNormalText, {color: COLORS.lightGray}]}
                >
                  {formatProgressTime(item.progress)}
                </Text>
              </View>
              {index !== others.length - 1 && (
                <View style={{height: 0.5, backgroundColor: "gray"}}></View>
              )}
            </View>
          );
        })}
      </View>
    </UIBlock>
  );
};
