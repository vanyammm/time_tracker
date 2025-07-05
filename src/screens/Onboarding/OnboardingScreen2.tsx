import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {GradientAvatarShuffle} from "../../components/AvatarGradientPicker/AvatarGradientPicker";
import {styles} from "./styles";

export const OnboardingScreen2 = () => {
  // console.log("onboarding screen 2");

  // Ця функція завершить онбордінг

  // const {gradient} = useOnboardingData();

  // useEffect(() => {
  //   console.log("gradient in context changed: ", gradient);
  // }, [gradient]);

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
      <GradientAvatarShuffle />
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
