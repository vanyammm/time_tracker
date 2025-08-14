import {StyleSheet} from "react-native";
import {COLORS} from "../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    height: 5,
    backgroundColor: COLORS.lightDarkBlue,
    borderRadius: 4,
    overflow: "hidden",
    marginHorizontal: 20,
    marginBottom: 7,
    width: 230,
  },
  progress: {
    height: "100%",
    backgroundColor: COLORS.lightGreen,
    borderRadius: 4,
  },
});
