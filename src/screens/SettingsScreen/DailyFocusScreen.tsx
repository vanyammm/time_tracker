import {ActivityIndicator, Alert, SafeAreaView, Text, View} from "react-native";
import {commonScreenStyles} from "../commonStyles";
import {common} from "../../theme/commonStyles";
import {Timer} from "../../components/Timer/Timer";
import {useUserStore} from "../../store/userStore";
import {useUpdateUserDailyGoalMutation} from "../../store/api/apiSlice";

export const DailyFocusScreen = () => {
  const {user, setUser} = useUserStore();
  const [updateDailyGoal, {isLoading}] = useUpdateUserDailyGoalMutation();

  const handleSaveDailyGoal = async (minutes: number) => {
    if (!user) return;

    if (user.dailyGoalMinutes === minutes) {
      return;
    }

    try {
      const updatedUser = await updateDailyGoal({
        userId: user.id,
        dailyGoalMinutes: minutes,
      }).unwrap();

      setUser(updatedUser);
      console.log("Daily goal updated successfully!");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not update your daily goal.");
    }
  };

  if (!user) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={commonScreenStyles.container}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 22,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{width: 170}}>
          <Text
            style={[
              common.whiteHugeText,
              {fontWeight: 800, textAlign: "center"},
            ]}
            numberOfLines={2}
          >
            Daily Focus Goal
          </Text>
        </View>
        <Timer onSaveGoal={handleSaveDailyGoal} />
      </View>
    </SafeAreaView>
  );
};
