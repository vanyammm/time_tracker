import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {styles} from "./styles";
import {commonScreenStyles} from "../commonStyles";
import {common} from "../../theme/commonStyles";
import {Coin} from "../../../assets/Coin";
import {Timer} from "../../components/Timer/Timer";
import {UIButton} from "../../components/UIButton/UIButton";
import {TimerSlider} from "./TimerSlider/TimerSlider";
import {Gear} from "../../assets/svg/Gear";
import {useTimerActions, useTimerStore} from "../../store/timerStore";
import {useState} from "react";
import {FocusEndModal} from "../../components/FocusEndModal/FocusEndModal";

export const ActivityScreen = () => {
  const status = useTimerStore((state) => state.status);
  const {startTimer, pauseTimer, resumeTimer, stopTimer} = useTimerActions();
  const [modalVisible, setModalVisible] = useState(false);
  const [secondsPassed, setSecondsPassed] = useState(0);

  const handleStopActivity = () => {
    const seconds = stopTimer();
    setSecondsPassed(seconds);
    setModalVisible(true);
  };

  return (
    <View style={[commonScreenStyles.container, styles.container]}>
      <View style={[styles.screenTopContainer]}>
        <View style={[styles.creditsContainer]}>
          <Text style={common.whiteNormalText}>900</Text>
          <Coin />
        </View>
        <Gear width={30} height={30} />
      </View>
      <TimerSlider />
      {status === "idle" && (
        <UIButton
          style={{
            marginTop: "auto",
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
            gap: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "purple",
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderRadius: 10,
            }}
            onPress={pauseTimer}
          >
            <Text>Pause</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "purple",
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderRadius: 10,
            }}
            onPress={resumeTimer}
          >
            <Text>Resume</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "purple",
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderRadius: 10,
            }}
            onPress={handleStopActivity}
          >
            <Text>Stop</Text>
          </TouchableOpacity>
        </View>
      )}
      <FocusEndModal
        visible={modalVisible}
        setVisible={setModalVisible}
        secondsPassed={secondsPassed}
        setSecondsPassed={setSecondsPassed}
      />
    </View>
  );
};
