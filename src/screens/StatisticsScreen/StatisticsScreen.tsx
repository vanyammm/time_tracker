import {View, Dimensions} from "react-native";
import {commonScreenStyles} from "../commonStyles";

const {width} = Dimensions.get("window");

export const StatiscticsScreen = () => {
  return (
    <View
      style={[
        commonScreenStyles.container,
        {alignItems: "center", justifyContent: "center"},
      ]}
    ></View>
  );
};
