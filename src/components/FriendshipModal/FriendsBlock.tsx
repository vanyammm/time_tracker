import {Alert, Text, View} from "react-native";
import {useUserStore} from "../../store/userStore";
import {
  useGetFriendsQuery,
  useRemoveFriendMutation,
} from "../../store/api/apiSlice";
import {common} from "../../theme/commonStyles";
import {FontWeight} from "@shopify/react-native-skia";
import {UserCard} from "./UserCard";

export const FriendsBlock = () => {
  const currentUser = useUserStore((state) => state.user);

  const {data: friends} = useGetFriendsQuery(currentUser?.id, {
    skip: !currentUser,
  });

  const [removeFriend, {isLoading: isFriendRemoving, originalArgs}] =
    useRemoveFriendMutation();

  const handleRemoveFriend = async (friendId: number) => {
    if (!currentUser) return;

    Alert.alert(
      "Unfriend Confirmation",
      "Are you sure you want to unfriend that user?",
      [
        {text: "Cancel", style: "cancel"},
        {
          text: "Unfriend",
          style: "destructive",
          onPress: async () => {
            try {
              await removeFriend({
                currentUserId: currentUser.id,
                friendId,
              }).unwrap();
            } catch (error: any) {
              console.error("removing user from friend list error:", error);
            }
          },
        },
      ],
    );
  };

  return (
    <View>
      {friends && friends.length > 0 && (
        <>
          <Text
            style={[
              common.whiteNormalText,
              {fontWeight: 600, marginBottom: 10},
            ]}
          >
            Friends
          </Text>
          {friends.map((friend) => (
            <UserCard
              user={friend}
              key={friend.id}
              type="friend"
              onAction={handleRemoveFriend}
              isActionLoading={
                isFriendRemoving && originalArgs?.friendId === friend.id
              }
            />
          ))}
        </>
      )}
    </View>
  );
};
