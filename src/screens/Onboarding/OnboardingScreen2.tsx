import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {GradientAvatarShuffle} from "../../components/AvatarGradientPicker/AvatarGradientPicker";
import {styles} from "./styles";
import {
  useOnboardingActions,
  useOnboardingState,
} from "../../store/onboardingStore";

export const OnboardingScreen2 = () => {
  const {registrationData} = useOnboardingState();
  const {updateRegistrationData} = useOnboardingActions();

  return (
    <View style={styles.onBoardingScreen}>
      <View
        style={{
          width: 300,
        }}
      >
        <Text style={styles.screenHeaderText} numberOfLines={2}>
          Start by choosing your avatar
        </Text>
      </View>
      <GradientAvatarShuffle
        initialGradient={
          registrationData.avatarGradient || ["#ff7e5f", "#feb47b"]
        }
        onSave={(newGradient) =>
          updateRegistrationData({avatarGradient: newGradient})
        }
      />
      <Text style={[styles.screenSecondaryText]}>Tap the Orb to shuffle</Text>
    </View>
  );
};

// Спільні стилі для екранів онбордінгу
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: COLORS.darkBlue,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     color: "white",
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 50,
//   },
//   button: {
//     backgroundColor: "white",
//     paddingHorizontal: 30,
//     paddingVertical: 15,
//     borderRadius: 25,
//   },
//   buttonText: {
//     color: COLORS.darkBlue,
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });
