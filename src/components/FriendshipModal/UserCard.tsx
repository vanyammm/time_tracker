import {Text, TouchableOpacity, View} from "react-native";
import {UserForState} from "../../store/api/apiSlice";
import {UIBlock} from "../UIBlock/UIBlock";
import {UserAvatarCircle} from "../UserAvatarCircle/UserAvatarCircle";
import {styles} from "./styles";
import {common} from "../../theme/commonStyles";
import {FileCopy} from "../../assets/svg/FileCopy";

interface UserCardProps {
  user: UserForState | null;
  type: "own" | "friend" | "pending_invite";
}

export const UserCard: React.FC<UserCardProps> = ({user, type}) => {
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
              style={{width: 40, height: 40}}
            />
            <Text style={[common.whiteBiggerSemiBoldText]}>
              {user.username}
            </Text>
          </View>
        )}
        {type === "own" && (
          <TouchableOpacity style={[styles.copyButton]}>
            <FileCopy />
          </TouchableOpacity>
        )}
      </View>
    </UIBlock>
  );
};
