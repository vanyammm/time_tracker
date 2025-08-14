import {FlatList, Pressable, SafeAreaView, View} from "react-native";
import {commonScreenStyles} from "../commonStyles";
import {useUserStore} from "../../store/userStore";
import {useGetArchivedChallengesQuery} from "../../store/api/apiSlice";
import {ArchivedChallengeCard} from "../../components/ChallengeCard/ArchivedChallengeCard";
import {useNavigation} from "@react-navigation/native";
import {RootStackParamList} from "../../navigation/types";
import {StackNavigationProp} from "@react-navigation/stack";

type ArchiveNavigationProp = StackNavigationProp<RootStackParamList>;

export const ChallengeAcrhiveScreen = () => {
  const currentUser = useUserStore((state) => state.user);
  const {data: challenges} = useGetArchivedChallengesQuery(currentUser!.id, {
    skip: !currentUser,
  });

  const archiveNavigation = useNavigation<ArchiveNavigationProp>();

  const handleChallengePress = (challengeId: number) => {
    archiveNavigation.navigate("ChallengeDetails", {challengeId});
  };

  return (
    <SafeAreaView style={[commonScreenStyles.container]}>
      <View style={{alignItems: "center"}}>
        <FlatList
          width={"90%"}
          data={challenges}
          renderItem={({item}) => (
            <Pressable onPress={() => handleChallengePress(item.id)}>
              <ArchivedChallengeCard challenge={item} />
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
};
