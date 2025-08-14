import {FlatList, Text, TouchableOpacity, View} from "react-native";
import {useUserStore} from "../../store/userStore";
import {useGetGroupedChallengesQuery} from "../../store/api/apiSlice";
import {common} from "../../theme/commonStyles";
import {useEffect, useState, forwardRef, useImperativeHandle} from "react";
import type {GroupedChallenge} from "../../../db/schema";
import {styles} from "./styles";

type SelectableGroupedChallenge = GroupedChallenge & {
  selected: boolean;
};

export type ChallengesIdListHandle = {
  getChallengesIdListState: () => number[];
};

export const GroupedChallengesList = forwardRef<ChallengesIdListHandle, {}>(
  (_props, ref) => {
    const currentUser = useUserStore((state) => state.user);

    const {data: groupedChallenges, isLoading} = useGetGroupedChallengesQuery(
      currentUser?.id,
      {
        skip: !currentUser,
      },
    );

    const [groupedChallengesSelect, setGroupedChallengesSelect] = useState<
      SelectableGroupedChallenge[]
    >([]);

    useEffect(() => {
      if (groupedChallenges) {
        const selectableChallenges = groupedChallenges.map((obj) => ({
          ...obj,
          selected: true,
        }));

        setGroupedChallengesSelect(selectableChallenges);
      }
    }, [groupedChallenges]);

    const handleToggleSelect = (action: string) => {
      setGroupedChallengesSelect((prev) =>
        prev.map((challenge) =>
          challenge.action === action
            ? {...challenge, selected: !challenge.selected}
            : challenge,
        ),
      );
    };

    useImperativeHandle(ref, () => ({
      getChallengesIdListState: () =>
        groupedChallengesSelect
          .filter((item) => item.selected)
          .flatMap((item) => item.challengeIds),
    }));

    return (
      <View>
        <FlatList
          data={groupedChallengesSelect}
          ItemSeparatorComponent={() => <View style={{height: 8}} />}
          renderItem={({item}) => (
            <View style={[styles.groupedChallengesListItem]}>
              <Text style={[common.whiteBigSemiBoldText]}>{item.action}</Text>
              <TouchableOpacity
                style={[styles.selectButton]}
                onPress={() => handleToggleSelect(item.action)}
              >
                {item.selected && <View style={[styles.selectedView]} />}
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    );
  },
);
