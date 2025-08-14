import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../navigation/types";
import {Pressable, SafeAreaView, View} from "react-native";
import {commonScreenStyles} from "../commonStyles";
import {styles} from "./styles";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {Friend} from "../../services/friendshipService";
import {useGetFriendsQuery} from "../../store/api/apiSlice";
import {Participant} from "../ChallengeDetailsScreen/Participant";
import {ChallengeCreationStackParamList} from "../../navigation/ChallengeCreationNavigator";
import {useChallengeCreationStore} from "../../store/challengeCreationStore";

type SelectFriendNavigationProp =
  StackNavigationProp<ChallengeCreationStackParamList>;
type SelectFriendRouteProp = RouteProp<
  ChallengeCreationStackParamList,
  "SelectFriends"
>;

export const SelectFriendsScreen = () => {
  const navigation = useNavigation<SelectFriendNavigationProp>();
  const route = useRoute<SelectFriendRouteProp>();
  const {userId} = route.params;

  const {data: allFriends, isLoading} = useGetFriendsQuery(userId, {
    skip: !userId,
  });

  const {selectedFriends, toggleFriend, setSelectedFriends} =
    useChallengeCreationStore();

  const handleToggleFriend = (friend: Friend) => {
    toggleFriend(friend);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[commonScreenStyles.container]}>
      <View style={[styles.container]}>
        {allFriends && allFriends.length > 0 && (
          <View style={{gap: 5}}>
            {allFriends.map((item) => {
              const isSelected = selectedFriends.some((f) => f.id === item.id);
              return (
                <Pressable
                  style={{
                    width: "100%",
                  }}
                  onPress={() => handleToggleFriend(item)}
                  key={item.id}
                >
                  <Participant
                    selectMode
                    selected={isSelected}
                    gradientColors={item.avatarGradient}
                    username={item.username}
                    coins={item.coins}
                  />
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
