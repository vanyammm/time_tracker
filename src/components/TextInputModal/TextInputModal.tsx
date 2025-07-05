import { ReactNode, useState } from "react";
import { Button, Modal, Text, View, TextInput, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { TEXT_COLORS } from "../../theme/colors";
import { common } from "../../theme/commonStyles";

interface TextInputModalProps {
    title: string;
    visible: boolean;
    changeValue: string;
    setChangeValue: React.Dispatch<React.SetStateAction<string>>;
    keyboardType?: "default" | "numeric";
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    children: ReactNode;
};

export const TextInputModal: React.FC<TextInputModalProps> = ({
    title,
    visible,
    changeValue,
    setChangeValue,
    keyboardType,
    setVisible,
    onClose,
    children    
}) => {
    const [localChangeValue, setLocalChangeValue] = useState(changeValue);

    const handleSubmit = () => {
        setChangeValue(localChangeValue);
        setVisible((prev) => !prev);
    };
    return (
        <Modal
            visible={visible}
            animationType='fade'
            transparent
            style={{alignItems: 'center', justifyContent: 'center'}}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <Text style={styles.modalDescription}>
                        {children}
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        autoFocus={true}
                        keyboardType={keyboardType || 'default'}
                        value={localChangeValue}
                        onChangeText={(text) => setLocalChangeValue(text)}/>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            onPress={() => setVisible((prev) => !prev)}
                            style={[styles.button, { borderBottomStartRadius: 10, borderStartWidth: 0 }]}>
                            <Text style={[common.boldText, common.normalSizeText, common.whiteText]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            style={[styles.button, { borderBottomEndRadius: 10, borderEndWidth: 0 }]}>
                            <Text style={[common.whiteText, common.normalSizeText]}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View> 
            </View>
        </Modal>
    );
};