import {ScrollView} from "react-native";
import {SearchBlock} from "./SearchBlock";
import {FriendsBlock} from "./FriendsBlock";
import {PendingRequestsBlock} from "./PendingRequestsBlock";
import {useUserStore} from "../../store/userStore";
import {UserCard} from "./UserCard";

export const FriendshipContent = () => {
  const user = useUserStore((state) => state.user);

  return (
    <>
      {user && <UserCard user={user} type="own" />}

      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchBlock />
        <FriendsBlock />
        <PendingRequestsBlock />
      </ScrollView>
    </>
  );
};
