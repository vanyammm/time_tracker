import {SafeAreaView, View} from "react-native";
import {commonScreenStyles} from "../commonStyles";
import {FriendshipContent} from "../../components/FriendshipModal/FriendshipContent";

export const ManageFriendshipsScreen = () => {
  return (
    <SafeAreaView style={commonScreenStyles.container}>
      <View style={{flex: 1, marginHorizontal: 22, paddingTop: 15}}>
        <FriendshipContent />
      </View>
    </SafeAreaView>
  );
};
