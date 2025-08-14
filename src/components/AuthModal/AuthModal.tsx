import {useForm, Controller} from "react-hook-form";
import {useSignInMutation, useSignUpMutation} from "../../store/api/apiSlice";
import {useUserStore} from "../../store/userStore";
import {yupResolver} from "@hookform/resolvers/yup";
import {registrationSchema} from "../../validationSchema";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {common} from "../../theme/commonStyles";
import {COLORS} from "../../theme/colors";
import React from "react";

interface AuthModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthModal: React.FC<AuthModalProps> = ({visible, setVisible}) => {
  const [signIn] = useSignInMutation();

  const {user, setUser} = useUserStore();

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm({
    resolver: yupResolver(registrationSchema),
    mode: "onChange",
  });

  const handleSignInPress = async (data: {
    username: string;
    password: string;
  }) => {
    Keyboard.dismiss();
    const result = await signIn(data);
    if ("data" in result) {
      setUser(result.data!);
    } else if ("error" in result && result.error) {
      Alert.alert("SignIn error", (result.error as any).message);
    }
  };

  const handleCloseModal = () => {
    if (user) {
      setVisible(false);
    } else {
      Alert.alert("You cannot leave this modal before you sign in");
    }
  };
  return (
    <Modal
      visible={visible}
      presentationStyle="pageSheet"
      animationType="slide"
      onRequestClose={handleCloseModal}
    >
      <KeyboardAvoidingView style={[localStyles.modal]} behavior="padding">
        <Text style={[common.whiteText, localStyles.screenHeaderText]}>
          Sign In
        </Text>
        <View style={[localStyles.authForm]}>
          <Controller
            control={control}
            name="username"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={[localStyles.input]}
                onBlur={onBlur}
                value={value}
                onChangeText={onChange}
                placeholder="Nickname"
                placeholderTextColor={COLORS.lightGray}
              />
            )}
          />
          {errors.username && (
            <Text style={[localStyles.errorText]}>
              {errors.username.message}
            </Text>
          )}
          <Controller
            control={control}
            name="password"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={[localStyles.input]}
                value={value}
                onChangeText={onChange}
                placeholder="Password"
                placeholderTextColor={COLORS.lightGray}
                secureTextEntry
              />
            )}
          />
          <View style={localStyles.authFormButtons}>
            <TouchableOpacity
              style={[localStyles.signInButton]}
              onPress={handleSubmit(handleSignInPress)}
            >
              <Text style={[common.whiteNormalBoldText]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const localStyles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.dark,
  },
  authForm: {
    backgroundColor: COLORS.lightDarkBlue,
    padding: 20,
    gap: 10,
    borderRadius: 8,
    width: "95%",
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: COLORS.darkBlue,
    color: "white",
    fontSize: 20,
    borderRadius: 7,
  },
  authFormButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  signInButton: {
    backgroundColor: COLORS.midDarkBlue,
    flex: 0.4,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: "auto",
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginTop: -5,
    marginBottom: 5,
  },
  screenHeaderText: {
    fontSize: 33,
    fontWeight: 800,
    textAlign: "center",
    color: "white",
    marginBottom: 15,
  },
});
