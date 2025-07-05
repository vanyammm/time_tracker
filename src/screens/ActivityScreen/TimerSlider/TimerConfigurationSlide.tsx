import {Text, View} from "react-native";
import {UIButton} from "../../../components/UIButton/UIButton";
import {common} from "../../../theme/commonStyles";
import {styles} from "./styles";
import {MobileSlash} from "../../../assets/svg/MobileSlash";

export const TimerConfigurationSlide: React.FC = () => {
  return (
    <View style={[styles.timerConfigurationContainer]}>
      <Text style={[styles.timerSettingsHeaderText]}>Timer Settings</Text>
      <View style={[styles.timerModeButtons]}>
        <UIButton style={[styles.timerModeButton]}>Countdown</UIButton>
        <UIButton style={[styles.timerModeButton]}>Pomodoro</UIButton>
        <UIButton style={[styles.timerModeButton]}>Stopwatch</UIButton>
      </View>
      <View style={[styles.lockAppsTipBlock]}>
        <View style={[styles.phoneIconMock]}>
          <MobileSlash width={30} height={37} />
        </View>
        <View>
          <Text style={[styles.lockAppsTipBlockPrimaryText]}>
            Lock Apps During Focus
          </Text>
          <Text style={[styles.lockAppsTipBlockSecondaryText]}>
            No apps or categories selected
          </Text>
        </View>
        <Text style={{color: "white", fontSize: 30, fontWeight: 600}}>
          {">"}
        </Text>
      </View>
      <Text style={[styles.lockAppsTipBlockSecondaryText]}>
        * Timero Pro Required
      </Text>
    </View>
  );
};
