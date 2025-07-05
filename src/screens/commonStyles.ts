import { StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";

export const commonScreenStyles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.darkBlue, 
        flex: 1,
    },
    text: {
        color: 'white',
    }
});