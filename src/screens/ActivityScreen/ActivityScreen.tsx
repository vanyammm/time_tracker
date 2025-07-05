import {View, Text, StyleSheet, Dimensions} from "react-native";
import {styles} from "./styles";
import {commonScreenStyles} from "../commonStyles";
import {common} from "../../theme/commonStyles";
import {Coin} from "../../../assets/Coin";
import {Timer} from "../../components/Timer/Timer";
import {UIButton} from "../../components/UIButton/UIButton";
import {TimerSlider} from "./TimerSlider/TimerSlider";
import {Gear} from "../../assets/svg/Gear";

export const ActivityScreen = () => {
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
      <UIButton
        style={{
          marginTop: "auto",
          paddingVertical: 18,
          paddingHorizontal: 70,
          borderRadius: 20,
        }}
      >
        <Text style={{fontSize: 20, fontWeight: 500, color: "white"}}>
          Focus
        </Text>
      </UIButton>
    </View>
  );
};
