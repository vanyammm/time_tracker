import { StyleSheet } from "react-native";
import { COLORS } from "../../theme/colors";

const LOCAL_COLORS = {
    inputBorder: '#707070',
};

export const styles = StyleSheet.create({
        modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "70%",
        backgroundColor: "rgba(44, 44, 44, 0.9)",
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontWeight: '600',
        color: 'white',
        fontSize: 16,
        alignSelf: 'center',
        marginBottom: 3,
    },
    modalDescription: {
        textAlign: 'center',
        color: 'white',
        marginBottom: 8,
    },
    textInput: {
        width: '100%',
        borderRadius: 4,
        borderWidth: 1,
        height: 30,
        borderColor: LOCAL_COLORS.inputBorder,
        backgroundColor: COLORS.darkBlue,
        color: 'white',
        paddingHorizontal: 10,
        marginBottom: 36,
    },
    buttonsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        width: '116%',
    },
    button: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 13,
        borderBottomWidth: 0
    },
});