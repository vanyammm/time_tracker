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
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {common} from "../../theme/commonStyles";
import {UIButton} from "../../components/UIButton/UIButton";
import {COLORS} from "../../theme/colors";
import React from "react";
import {commonScreenStyles} from "../commonStyles";
import {StackNavigationProp} from "@react-navigation/stack";
import {RootStackParamList} from "../../navigation/types";
import {CommonActions, useNavigation} from "@react-navigation/native";

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const AuthModalScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const [signIn, {isLoading: isSigningIn, error: signInError}] =
    useSignInMutation();

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
    try {
      const result = await signIn(data).unwrap();
      setUser(result);

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: "MainApp", params: {screen: "Activity"}}],
        }),
      );
    } catch (error: any) {
      Alert.alert(
        "Sign In Error",
        error.message || "An unknown error occurred.",
      );
    }
  };

  const handleGoToSignUp = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: "OnboardingFlow"}],
      }),
    );
  };

  const handleCloseModal = () => {};
  return (
    <SafeAreaView style={commonScreenStyles.container}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          marginHorizontal: 22,
          alignItems: "center",
          justifyContent: "center",
        }}
        behavior="padding"
      >
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
              disabled={isSigningIn}
            >
              <Text style={[common.whiteNormalBoldText]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={localStyles.signUpContainer}>
          <Text style={localStyles.signUpText}>Don't have an account?</Text>
          <Pressable onPress={handleGoToSignUp}>
            <Text style={localStyles.signUpButtonText}>Create Account</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  signUpContainer: {
    flexDirection: "row",
    marginTop: 30,
    alignItems: "center",
  },
  signUpText: {
    color: COLORS.lightGray,
    fontSize: 16,
  },
  signUpButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
});
