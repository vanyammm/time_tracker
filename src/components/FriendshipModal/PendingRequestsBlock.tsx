import {ActivityIndicator, Text, View} from "react-native";
import {
  useGetPendingFriendRequestsQuery,
  useHandleFriendRequestMutation,
} from "../../store/api/apiSlice";
import {useUserStore} from "../../store/userStore";
import {UserCard} from "./UserCard";
import {common} from "../../theme/commonStyles";

export const PendingRequestsBlock = () => {
  const user = useUserStore((state) => state.user);

  const {data: pendingFriendRequests, isLoading} =
    useGetPendingFriendRequestsQuery(
      {
        userId: user?.id,
        direction: "outgoing",
      },
      {
        skip: !user,
      },
    );

  const [declineFriendRequest] = useHandleFriendRequestMutation();

  const handleDeclinePress = async (receiverId: number) => {
    if (!user) return;

    try {
      console.log("trying to decline friend request");
      await declineFriendRequest({
        senderId: user.id,
        receiverId: receiverId,
        action: "decline",
      }).unwrap();
      console.log("deleted friend request");
    } catch (error: any) {
      console.error("error while declining friend request,", error);
    }
  };

  if (isLoading) {
    return (
      <View style={{width: "100%", alignItems: "center", padding: 20}}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <View>
      {pendingFriendRequests && pendingFriendRequests.length > 0 && (
        <>
          <Text
            style={[
              common.whiteNormalBoldText,
              {fontWeight: 600, marginBottom: 10},
            ]}
          >
            Pending Invites
          </Text>
          {pendingFriendRequests.map((request) => (
            <UserCard
              key={request.id}
              type="pending_invite"
              user={request}
              inModal
              onDecline={handleDeclinePress}
            />
          ))}
        </>
      )}
    </View>
  );
};
