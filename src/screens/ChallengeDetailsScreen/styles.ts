import {StyleSheet} from "react-native";
import {COLORS} from "../../theme/colors";

const HORIZONTAL_PADDING = 22;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: HORIZONTAL_PADDING,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
  },
  daysPassedBlock: {
    paddingHorizontal: 4,
    paddingVertical: 6,
    backgroundColor: COLORS.gray,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
  },
  participantWrapper: {
    paddingHorizontal: HORIZONTAL_PADDING,
  },
});
