import {StyleSheet, Text, View} from "react-native";
import {Coin} from "../../../assets/Coin";
import {common} from "../../theme/commonStyles";
import {formatDate} from "../../utils/utils";

interface Props {
  buyIn: number;
  startDate: string;
  hostUsername: string;
}

export const ChallengeInviteInfoBlock: React.FC<Props> = ({
  buyIn,
  startDate,
  hostUsername,
}) => {
  return (
    <View style={[localStyles.container]}>
      <View>
        <Text style={[common.grayNormalText]}>Buy-In</Text>
        <View style={[localStyles.coins]}>
          <Text style={[common.whiteNormalBoldText]}>{buyIn}</Text>
          <Coin />
        </View>
      </View>
      <View>
        <Text style={[common.grayNormalText]}>Starts</Text>
        <Text style={[common.whiteNormalBoldText]}>
          {formatDate(startDate)}
        </Text>
      </View>
      <View>
        <Text style={[common.grayNormalText]}>Host</Text>
        <Text style={[common.whiteNormalBoldText]}>{hostUsername}</Text>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  coins: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
});
