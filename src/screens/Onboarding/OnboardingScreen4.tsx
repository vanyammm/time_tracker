import React, {useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  Alert,
} from "react-native";
import {common} from "../../theme/commonStyles";
import {styles} from "./styles";
import {COLORS} from "../../theme/colors";
import {useOnboardingData} from "../../context/OnboardingContext";
import {UIButton} from "../../components/UIButton/UIButton";
import {useForm, Controller} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {registrationSchema} from "../../validationSchema";
import {useSignInMutation, useSignUpMutation} from "../../store/api/apiSlice";
import {useUserStore} from "../../store/userStore";
import {
  useOnboardingActions,
  useOnboardingState,
} from "../../store/onboardingStore";

export const OnboardingScreen4 = () => {
  const [signIn, {isLoading: isSigningIn, error: signInError}] =
    useSignInMutation();
  const [signUp, {isLoading: isSigningUp, error: signUpError}] =
    useSignUpMutation();

  const {registrationData} = useOnboardingState();
  const {setIsNextStepAllowed} = useOnboardingActions();

  const {user, setUser} = useUserStore();

  if (user) console.log(`SCREEN_4. user: ${user.username}`);

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm({
    resolver: yupResolver(registrationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (!user) setIsNextStepAllowed(false);
    else setIsNextStepAllowed(true);
  }, [user]);

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

  const handleSignUpPress = async (data: {
    username: string;
    password: string;
  }) => {
    Keyboard.dismiss();
    const finalRegistrationData = {
      ...registrationData,
      username: data.username,
      password: data.password,
    };
    const result = await signUp(finalRegistrationData);
    if ("data" in result) {
      setUser(result.data!);
    } else if ("error" in result && result.error) {
      Alert.alert("SignUp error", (result.error as any).message);
    }
  };

  return (
    <View style={[styles.onBoardingScreen]}>
      <KeyboardAvoidingView style={{width: "90%"}}>
        <Text style={[common.whiteText, styles.screenHeaderText]}>
          Sign In / Sign Up
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
            <UIButton
              onPress={handleSubmit(handleSignUpPress)}
              style={{
                marginHorizontal: "auto",
                paddingHorizontal: 20,
                paddingVertical: 12,
              }}
            >
              Sign Up
            </UIButton>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  authForm: {
    backgroundColor: COLORS.lightDarkBlue,
    padding: 20,
    gap: 10,
    borderRadius: 8,
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
});
