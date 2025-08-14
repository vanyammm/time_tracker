import {StyleSheet} from "react-native";
import {COLORS} from "../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 10,
    flexDirection: "column",
  },
  screenTopContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 80,
  },
  creditsContainer: {
    flexDirection: "row",
    gap: 3,
  },
});
