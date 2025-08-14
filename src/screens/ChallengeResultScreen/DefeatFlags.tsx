import {View, Dimensions} from "react-native";
import {FinishFlag} from "../../assets/svg/FinishFlag";

const {width} = Dimensions.get("window");

interface Props {
  small?: boolean;
}

export const DefeatFlags: React.FC<Props> = ({small}) => {
  return (
    <View
      style={[
        {backgroundColor: "purple"},
        small ? {height: 70} : {height: 130, width: "100%"},
      ]}
    >
      <FinishFlag
        width={small ? 50 : 100}
        height={small ? 70 : 130}
        style={{
          position: "absolute",
          right: (small ? 0 : width / 2) - (small ? 50 : 75),
        }}
        transform={[{rotate: "65deg"}]}
        fill={"red"}
      />
      <FinishFlag
        width={small ? 50 : 100}
        height={small ? 70 : 130}
        style={{
          position: "absolute",
          right: (small ? 0 : width / 2) - 25,
        }}
        fill={"red"}
        transform={[{scaleX: -1}, {rotate: "65deg"}]}
      />
    </View>
  );
};
