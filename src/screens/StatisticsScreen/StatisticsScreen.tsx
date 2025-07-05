import {View, Text, StyleSheet, Button, Dimensions, Image} from "react-native";
import {commonScreenStyles} from "../commonStyles";
import {GradientAvatarShuffle} from "../../components/AvatarGradientPicker/AvatarGradientPicker";
import Carousel from "react-native-reanimated-carousel";

const {width} = Dimensions.get("window");

export const StatiscticsScreen = () => {
  return (
    <View
      style={[
        commonScreenStyles.container,
        {alignItems: "center", justifyContent: "center"},
      ]}
    >
      {/* <GradientAvatarShuffle /> */}
      <Image
        source={require("../../assets/img/statistics_screen.jpg")}
        style={{width: 300, height: 260}}
      />
    </View>
  );
};
