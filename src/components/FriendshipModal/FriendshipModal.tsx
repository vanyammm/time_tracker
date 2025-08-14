import {Modal, View, SafeAreaView, Dimensions} from "react-native";
import {styles} from "./styles";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import {UserForState} from "../../store/api/apiSlice";
import {useEffect} from "react";
import {FriendshipContent} from "./FriendshipContent";

interface FriendshipModalProps {
  user: UserForState | null;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;

export const FriendshipModal: React.FC<FriendshipModalProps> = ({
  user,
  visible,
  setVisible,
}) => {
  const translateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    translateY.value = withTiming(0);
  }, []);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 150) {
        translateY.value = withTiming(SCREEN_HEIGHT, {}, () => {
          runOnJS(setVisible)(false);
        });
      } else {
        translateY.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={() => setVisible(false)}
    >
      <GestureDetector gesture={gesture}>
        <View style={[styles.backdrop]}>
          <Animated.View style={[styles.modalContainer, animatedStyle]}>
            <SafeAreaView style={[styles.modal]}>
              <FriendshipContent />
            </SafeAreaView>
          </Animated.View>
        </View>
      </GestureDetector>
    </Modal>
  );
};
