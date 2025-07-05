import {View, StyleSheet, Text} from "react-native";
import {COLORS} from "../src/theme/colors";

export const Coin = () => {
  return (
    <View style={styles.coin}>
      <View style={styles.innerCircle}>
        <Text style={styles.coinText}>₸</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  coin: {
    width: 19,
    height: 19,
    borderRadius: "100%",
    backgroundColor: COLORS.coinColor,
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    borderRadius: "100%",
    width: 15,
    height: 15,
    backgroundColor: "#f5f058",
    borderColor: "#b3af42",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  coinText: {
    textAlignVertical: "center",
    textAlign: "center",
    color: "#c9c30c",
  },
});
