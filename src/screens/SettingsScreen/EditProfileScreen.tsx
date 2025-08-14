import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {GradientAvatarShuffle} from "../../components/AvatarGradientPicker/AvatarGradientPicker";
import {commonScreenStyles} from "../commonStyles";
import {useUserStore} from "../../store/userStore";
import {useEffect, useMemo, useState} from "react";
import {common} from "../../theme/commonStyles";
import {COLORS} from "../../theme/colors";
import {UIButton} from "../../components/UIButton/UIButton";
import {useUpdateUserProfileMutation} from "../../store/api/apiSlice";
import {UserUpdateData} from "../../services/authService";

export const EditProfileScreen = () => {
  const {user, setUser} = useUserStore();
  const [selectedGradient, setSelectedGradient] = useState(
    user?.avatarGradient || [],
  );
  const [changedUsername, setChangedUsername] = useState(user?.username || "");
  const [updateProfile, {isLoading}] = useUpdateUserProfileMutation();

  useEffect(() => {
    if (user) {
      setSelectedGradient(user.avatarGradient);
      setChangedUsername(user.username);
    }
  }, [user]);

  const hasChanges = useMemo(() => {
    if (!user) return false;

    const gradientChanged =
      JSON.stringify(selectedGradient) !== JSON.stringify(user.avatarGradient);
    const usernameChanged =
      changedUsername.trim() !== user.username &&
      changedUsername.trim().length > 0;
    return gradientChanged || usernameChanged;
  }, [selectedGradient, user, changedUsername]);

  const handleSaveChanges = async () => {
    if (!user || !hasChanges) return;
    console.log("handleSaveChanges");
    const dataToUpdate: UserUpdateData = {};
    if (
      JSON.stringify(selectedGradient) !== JSON.stringify(user.avatarGradient)
    ) {
      dataToUpdate.avatarGradient = selectedGradient;
    }
    if (changedUsername.trim() !== user.username) {
      dataToUpdate.username = changedUsername.trim();
    }

    if (Object.keys(dataToUpdate).length === 0) return;
    try {
      const updatedUser = await updateProfile({
        userId: user.id,
        data: dataToUpdate,
      }).unwrap();
      setUser(updatedUser);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not update your profile.");
    }
  };

  return (
    <SafeAreaView style={[commonScreenStyles.container]}>
      <View
        style={{
          flex: 1,
          marginHorizontal: 22,
          alignItems: "center",
        }}
      >
        <GradientAvatarShuffle
          initialGradient={user?.avatarGradient ?? ["#fff", "#000"]}
          onSave={setSelectedGradient}
        />
        <Text
          style={[common.grayNormalText, {fontSize: 14, marginVertical: 20}]}
        >
          Tap the orb to randomize
        </Text>
        <View style={{width: "100%"}}>
          <Text
            style={[
              common.grayNormalText,
              {fontSize: 14, marginBottom: 10, marginLeft: 14},
            ]}
          >
            PROFILE INFORMATION
          </Text>
          <TextInput
            value={changedUsername}
            onChangeText={setChangedUsername}
            style={localStyles.textInput}
          />
        </View>
        <UIButton
          style={{
            marginTop: "auto",
            paddingHorizontal: 80,
            paddingVertical: 17,
            borderRadius: 22,
          }}
          onPress={handleSaveChanges}
        >
          {isLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={[common.whiteBigBoldText, {fontWeight: 600}]}>
              Save
            </Text>
          )}
        </UIButton>
      </View>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  textInput: {
    width: "100%",
    borderRadius: 14,
    backgroundColor: COLORS.modalBg,
    color: "white",
    fontSize: 18,
    paddingVertical: 17,
    paddingHorizontal: 17,
  },
});
