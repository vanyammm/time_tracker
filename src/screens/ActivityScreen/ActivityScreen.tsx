import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
} from "react-native";
import {styles} from "./styles";
import {commonScreenStyles} from "../commonStyles";
import {common} from "../../theme/commonStyles";
import {Coin} from "../../../assets/Coin";
import {UIButton} from "../../components/UIButton/UIButton";
import {TimerSlider} from "./TimerSlider/TimerSlider";
import {Gear} from "../../assets/svg/Gear";
import {useTimerActions, useTimerStore} from "../../store/timerStore";
import {useState} from "react";
import {FocusEndModal} from "../../components/FocusEndModal/FocusEndModal";
import {useUserStore} from "../../store/userStore";
import {useGetUserByIdQuery} from "../../store/api/apiSlice";
import {Pause} from "../../assets/svg/Pause";
import {Playback} from "../../assets/svg/Playback";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../navigation/types";
import {useNavigation} from "@react-navigation/native";
import {COLORS} from "../../theme/colors";
import {Stop} from "../../assets/svg/Stop";

type ActivityScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const ActivityScreen = () => {
  const navigation = useNavigation<ActivityScreenNavigationProp>();
  const status = useTimerStore((state) => state.status);
  const {startTimer, pauseTimer, resumeTimer, stopTimer, adjustTime} =
    useTimerActions();
  const [modalVisible, setModalVisible] = useState(false);
  const [secondsPassed, setSecondsPassed] = useState(0);

  const user = useUserStore((state) => state.user);

  const {data: userData} = useGetUserByIdQuery(user?.id, {
    skip: !user,
  });

  const handleStopActivity = () => {
    const seconds = stopTimer();
    setSecondsPassed(seconds);
    setModalVisible(true);
  };

  const handleTogglePause = () => {
    if (status === "running") {
      pauseTimer();
    } else if (status === "paused") {
      resumeTimer();
    }
  };

  const handleSettingsPress = () => {
    navigation.navigate("Settings", {screen: "SettingsHome"});
  };

  const handleAdjustTime = (minutes: number) => {
    adjustTime(minutes);
  };

  return (
    <SafeAreaView style={[commonScreenStyles.container, styles.container]}>
      <View style={{paddingHorizontal: 10, flex: 1, alignItems: "center"}}>
        <View style={[styles.screenTopContainer]}>
          <View style={[styles.creditsContainer]}>
            <Text style={common.whiteNormalText}>{userData?.coins}</Text>
            <Coin />
          </View>
          <Pressable onPress={handleSettingsPress}>
            <Gear width={30} height={30} />
          </Pressable>
        </View>
        <TimerSlider />
        {status === "idle" && (
          <UIButton
            style={{
              marginTop: "auto",
              marginBottom: "auto",
              paddingVertical: 18,
              paddingHorizontal: 70,
              borderRadius: 20,
            }}
            onPress={startTimer}
          >
            <Text style={{fontSize: 20, fontWeight: 500, color: "white"}}>
              Focus
            </Text>
          </UIButton>
        )}
        {(status === "running" || status === "paused") && (
          <View
            style={{
              flexDirection: "row",
              gap: 20,
              alignItems: "center",
              justifyContent: "center",
              marginTop: "auto",
              marginBottom: "auto",
            }}
          >
            <Pressable
              onPress={() => handleAdjustTime(-5)}
              style={{padding: 17, paddingRight: 1}}
            >
              <Text style={[common.whiteNormalText, {fontWeight: 500}]}>
                -5
              </Text>
            </Pressable>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.blue,
                paddingVertical: 17,
                paddingHorizontal: 18,
                borderRadius: 18,
              }}
              onPress={handleTogglePause}
            >
              {status === "running" ? (
                <Pause width={20} height={20} />
              ) : (
                <Playback width={20} height={20} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.red,
                paddingVertical: 17,
                paddingHorizontal: 18,
                borderRadius: 18,
              }}
              onPress={handleStopActivity}
            >
              <Stop width={20} height={20} />
            </TouchableOpacity>
            <Pressable
              onPress={() => handleAdjustTime(5)}
              style={{padding: 17, paddingLeft: 1}}
            >
              <Text style={[common.whiteNormalText, {fontWeight: 500}]}>
                +5
              </Text>
            </Pressable>
          </View>
        )}
        <FocusEndModal
          visible={modalVisible}
          setVisible={setModalVisible}
          secondsPassed={secondsPassed}
          setSecondsPassed={setSecondsPassed}
        />
      </View>
    </SafeAreaView>
  );
};
