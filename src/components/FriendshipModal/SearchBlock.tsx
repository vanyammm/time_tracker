import {useState} from "react";
import {TouchableOpacity, View, ScrollView, Text} from "react-native";
import {TextInput} from "react-native-gesture-handler";
import {styles} from "./styles";
import {Search} from "../../assets/svg/Search";
import {
  useLazyFindUsersQuery,
  useSendFriendRequestMutation,
} from "../../store/api/apiSlice";
import {useUserStore} from "../../store/userStore";
import {UserCard} from "./UserCard";
import {common} from "../../theme/commonStyles";
import {COLORS} from "../../theme/colors";

export const SearchBlock = () => {
  const [inputValue, setInputValue] = useState("");
  const currentUser = useUserStore((state) => state.user);
  const [trigger, {data: foundUsers, isLoading, isError}] =
    useLazyFindUsersQuery();

  const [sendFriendRequest, {isLoading: isSendingFriendRequest}] =
    useSendFriendRequestMutation();

  const [sentRequestIds, setSentRequestIds] = useState<Set<number>>(new Set());

  const handleSearch = () => {
    setSentRequestIds(new Set());
    const trimmedValue = inputValue.trim();
    if (trimmedValue && currentUser) {
      trigger({query: trimmedValue, currentUserId: currentUser.id});
    }
  };

  const handleSendFriendRequest = async (receiverId: number) => {
    if (!currentUser || isSendingFriendRequest) return;
    try {
      await sendFriendRequest({
        senderId: currentUser.id,
        receiverId: receiverId,
      }).unwrap();
      console.log("Friend request sent successfully");
      setSentRequestIds((prevSet) => new Set(prevSet).add(receiverId));
    } catch (error: any) {
      console.error("Failed to send friend request:", error);
      if (error.message.includes("already sent")) {
        setSentRequestIds((prevSet) => new Set(prevSet).add(receiverId));
      }
    }
  };

  return (
    <View>
      <View style={{gap: 10}}>
        <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
          <TextInput
            value={inputValue}
            onChangeText={setInputValue}
            style={[styles.searchInput]}
            placeholder="Find new Friends"
          />
          <TouchableOpacity
            style={[styles.blueButton, {paddingHorizontal: 10}]}
            onPress={handleSearch}
          >
            <Search />
          </TouchableOpacity>
        </View>
        {foundUsers && (
          <View>
            <Text
              style={[
                common.whiteNormalBoldText,
                {fontWeight: 600, marginBottom: 10},
              ]}
            >
              Search Results
            </Text>
            {foundUsers.map((user) => {
              const isRequestSent = sentRequestIds.has(user.id);
              return (
                <UserCard
                  key={user.id}
                  type={"search_result"}
                  user={user}
                  onAction={handleSendFriendRequest}
                  isActionLoading={isSendingFriendRequest}
                  sentRequest={isRequestSent}
                />
              );
            })}
          </View>
        )}
        <View
          style={{
            height: 1,
            backgroundColor: COLORS.lightDarkBlue,
            marginBottom: 10,
            marginTop: 10,
          }}
        />
      </View>
    </View>
  );
};
