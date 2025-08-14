import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {UserForState} from "../../store/api/apiSlice";
import {UIBlock} from "../UIBlock/UIBlock";
import {UserAvatarCircle} from "../UserAvatarCircle/UserAvatarCircle";
import {styles} from "./styles";
import {common} from "../../theme/commonStyles";
import {FileCopy} from "../../assets/svg/FileCopy";
import {SearchedUser} from "../../services/authService";
import {AddFriend} from "../../assets/svg/AddFriend";
import {Check} from "../../assets/svg/Check";
import {UserXMark} from "../../assets/svg/UserXMark";
import {XMark} from "../../assets/svg/XMark";

interface UserCardProps {
  user: UserForState | SearchedUser | null;
  type: "own" | "friend" | "pending_invite" | "search_result";
  onAction?: (userId: number) => void;
  isActionLoading?: boolean;
  onAccept?: (userId: number) => void;
  onDecline?: (userId: number) => void;
  isAccepting?: boolean;
  isDeclining?: boolean;
  inModal?: boolean;
  sentRequest?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  type,
  onAction,
  isActionLoading = false,
  onAccept,
  onDecline,
  isAccepting = false,
  isDeclining = false,
  inModal = false,
  sentRequest = false,
}) => {
  if (!user) {
    return null;
  }

  const handleActionPress = () => {
    if (onAction) {
      onAction(user.id);
    }
  };
  const handleAcceptPress = () => {
    if (onAccept) {
      onAccept(user.id);
    }
  };
  const handleDeclinePress = () => {
    if (onDecline) {
      onDecline(user.id);
    }
  };

  return (
    <UIBlock style={{paddingHorizontal: 10, paddingVertical: 10}}>
      <View style={[styles.userCardContainer]}>
        {user && user.avatarGradient && (
          <View
            style={{
              flexDirection: "row",
              gap: type === "own" ? 20 : 8,
              alignItems: "center",
            }}
          >
            <UserAvatarCircle
              gradientColors={user.avatarGradient}
              style={{width: 35, height: 35}}
            />
            <Text style={[common.whiteBiggerSemiBoldText]}>
              {user.username}
            </Text>
          </View>
        )}
        {type === "own" && (
          <TouchableOpacity style={[styles.blueButton]}>
            <FileCopy />
          </TouchableOpacity>
        )}
        {type === "friend" && (
          <Pressable
            style={[styles.friendButton, {backgroundColor: "red"}]}
            onPress={handleActionPress}
          >
            <UserXMark width={16} height={16} />
          </Pressable>
        )}
        {type === "search_result" && (
          <Pressable
            style={[styles.friendButton]}
            onPress={handleActionPress}
            disabled={isActionLoading}
          >
            {isActionLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                {sentRequest ? (
                  <Check width={16} height={16} />
                ) : (
                  <AddFriend width={16} height={16} fill="white" />
                )}
              </>
            )}
          </Pressable>
        )}
        {type === "pending_invite" && (
          <View style={{flexDirection: "row", gap: 10}}>
            {!inModal && (
              <Pressable
                style={[styles.friendButton]}
                onPress={handleAcceptPress}
                disabled={isAccepting || isDeclining}
              >
                <Check width={17} height={17} />
              </Pressable>
            )}
            <Pressable
              style={[styles.friendButton, {backgroundColor: "red"}]}
              onPress={handleDeclinePress}
              disabled={isAccepting || isDeclining}
            >
              <XMark width={17} height={17} />
            </Pressable>
          </View>
        )}
      </View>
    </UIBlock>
  );
};
