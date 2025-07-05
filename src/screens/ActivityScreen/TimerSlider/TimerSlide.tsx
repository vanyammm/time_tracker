import {Text, View} from "react-native";
import {styles} from "./styles";
import {Timer} from "../../../components/Timer/Timer";
import {common} from "../../../theme/commonStyles";

export const TimerSlide: React.FC = () => {
  return (
    <View style={{alignItems: "center", flex: 1}}>
      <Text style={[common.whiteText, styles.screenHeader]}>Focus</Text>
      <Text style={[common.whiteNormalBoldText, styles.timerType]}>
        Countdown
      </Text>
      <Timer />
    </View>
  );
};
