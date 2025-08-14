import {StyleSheet, Text, View} from "react-native";
import {UIBlock} from "../../components/UIBlock/UIBlock";
import {common} from "../../theme/commonStyles";
import {Coin} from "../../../assets/Coin";

interface PrizePoolBlockProps {
  buyIn: number;
  participants: number;
}

export const PrizePoolBlock: React.FC<PrizePoolBlockProps> = ({
  buyIn,
  participants,
}) => {
  return (
    <UIBlock
      style={{
        justifyContent: "space-between",
        flexDirection: "row",

        paddingVertical: 10,
        borderRadius: 19,
      }}
    >
      <View style={localStyles.block}>
        <Text style={[common.grayNormalText]}>Buy-In</Text>
        <View style={localStyles.coinBlock}>
          <Coin />
          <Text style={[common.whiteBigBoldText]}>{buyIn}</Text>
        </View>
      </View>
      <View style={localStyles.block}>
        <Text style={[common.grayNormalText]}>Participants</Text>
        <Text style={[common.whiteBigBoldText]}>{participants}</Text>
      </View>
      <View style={localStyles.block}>
        <Text style={[common.grayNormalText]}>Prize-Pool</Text>
        <View style={localStyles.coinBlock}>
          <Coin />
          <Text style={[common.whiteBigBoldText]}>{buyIn * participants}</Text>
        </View>
      </View>
    </UIBlock>
  );
};

const localStyles = StyleSheet.create({
  block: {
    alignItems: "center",
    flex: 1,
    gap: 5,
    height: "100%",
  },
  coinBlock: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
});
