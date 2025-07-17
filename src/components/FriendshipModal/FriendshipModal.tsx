import {
  Modal,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Button,
  TextInput,
} from "react-native";
import {styles} from "./styles";
import {Gesture, GestureDetector} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import {UIBlock} from "../UIBlock/UIBlock";
import {UserAvatarCircle} from "../UserAvatarCircle/UserAvatarCircle";
import {UserForState} from "../../store/api/apiSlice";
import {useEffect} from "react";
import {UserCard} from "./UserCard";
import {SearchBlock} from "./SearchBlock";

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
              {user && <UserCard user={user} type="own" />}
              <SearchBlock />
            </SafeAreaView>
          </Animated.View>
        </View>
      </GestureDetector>
    </Modal>
  );
};
