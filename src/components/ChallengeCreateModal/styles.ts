import { StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";
import { GREEN_BUTTON_WIDTH } from "../../theme/commonStyles";

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0)", // Затемнення фону
  },
  overlay: {
      ...StyleSheet.absoluteFillObject,
  },
  modal: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.midDarkBlue,
    padding: 20,
    alignItems: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  whiteText: {
      color: 'white',
  },
  boldText: {
      fontWeight: '600',
  },
  textSize16: {
      fontSize: 16
  },
  modalHeaderText: {
      color: COLORS.lightGray,
      fontSize: 20,
      fontWeight: '500',
      marginBottom: 25,
  },
  startDateContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
      width: '100%',
  },
  startDate: {
      paddingVertical: 7,
      paddingHorizontal: 10,
      borderRadius: 5,
      backgroundColor: COLORS.lightDarkBlue,
  },
  challengeTypeContainer: {
      width: '100%',
      gap: 10,
      marginBottom: 10,
  },
  challengeTypeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    backgroundColor: COLORS.lightDarkBlue,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: 'white',
  },
  buttonText: {
    color: 'white',
  },
  activeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  activeButtonHighlight: {
    position: 'absolute',
    height: 57,
    borderRadius: 10,
    backgroundColor: 'white',
    zIndex: 2,
    left: 5,
    opacity: 0.9
  },
  challengeConfigurationContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  textInput: {
    color: 'white',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.lightDarkBlue,
    marginRight: 5,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buyInButton: {
    width: '100%',
    paddingVertical: 17,
    paddingHorizontal: 15,
    backgroundColor: COLORS.lightDarkBlue,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  createChallengeButton: {
    backgroundColor: COLORS.lightGreen,
    paddingHorizontal: 10,
    paddingVertical: 17,
    borderRadius: 14,
    width: GREEN_BUTTON_WIDTH,
    alignItems: 'center',
    marginTop: 40,
    alignSelf: 'center',
  },
});