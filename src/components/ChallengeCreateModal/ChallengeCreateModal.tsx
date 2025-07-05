import {use, useEffect, useRef, useState} from "react";
import {
  View,
  Text,
  Dimensions,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import {styles} from "./styles";
import {getCurrentFormattedDate} from "../../utils/utils";
import {ChallengeTypeButtons, challengeTypes} from "./ChallengeTypeButtons";
import {
  ChallengeConfiguration,
  ChallengeConfigurationHandle,
} from "./ChallengeConfiguration";
import {TextInputModal} from "../TextInputModal/TextInputModal";
import {common} from "../../theme/commonStyles";
import {Coin} from "../../../assets/Coin";

import {useOnboardingData} from "../../context/OnboardingContext";

import {useCreateChallengeMutation} from "../../store/api/apiSlice";
import {useUserStore} from "../../store/userStore";

const {height, width} = Dimensions.get("window");

interface ChallengeCreateModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onboarding?: boolean;
}

export const ChallengeCreateModal: React.FC<ChallengeCreateModalProps> = ({
  visible,
  setVisible,
  onboarding,
}) => {
  const onboardingContext = onboarding ? useOnboardingData() : null;
  const setCreatedChallengeId = onboardingContext?.setCreatedChallengeId;
  const ChallengeConfigurationRef = useRef<ChallengeConfigurationHandle>(null);

  const [createChallenge, {isLoading, isError, error}] =
    useCreateChallengeMutation();
  const currentUser = useUserStore((state) => state.user);

  const yPosition = useSharedValue(height);
  const overlayOpacity = useSharedValue(0.5);

  useEffect(() => {
    yPosition.value = withTiming(0, {duration: 500});
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: yPosition.value}],
  }));

  const [activeChallengeTypeButtonIndex, setActiveChallengeTypeButtonIndex] =
    useState(0);
  const challengeType = challengeTypes[activeChallengeTypeButtonIndex];
  const [buyInAmount, setBuyInAmount] = useState("100");
  const [buyInModalVisible, setBuyInModalVisible] = useState(false);

  const handleCloseModal = () => {
    overlayOpacity.value = 0;
    yPosition.value = withTiming(height, {duration: 500}, () => {
      runOnJS(setVisible)(false);
    });
  };

  const handleCreatePress = async () => {
    const challengeConfigurationData =
      ChallengeConfigurationRef.current?.getChallengeConfigurationState();
    if (challengeConfigurationData) {
      const {hoursAmount, daysAmount, focusTitle} = challengeConfigurationData;
      try {
        if (!currentUser) {
          throw new Error("User is not authenticated");
        }
        const newChallenge = await createChallenge({
          hostId: currentUser?.id,
          challengeData: {
            hoursAmount: parseInt(hoursAmount, 10),
            daysAmount:
              challengeType === "Regular" || challengeType === "Streak"
                ? parseInt(daysAmount, 10)
                : undefined,
            action: focusTitle,
            type: challengeType,
            buyIn: parseInt(buyInAmount, 10),
          },
        }).unwrap();
        if (onboarding) {
          if (setCreatedChallengeId) {
            setCreatedChallengeId(newChallenge.id);
          }
        }
      } catch (error) {
        console.error("Error creating challenge:", error);
      }

      handleCloseModal();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={() => setVisible(false)}
    >
      <Animated.View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[styles.modal, {height: height * 0.65}, animatedStyle]}
        >
          <Text style={styles.modalHeaderText}>New Challenge</Text>
          <View style={styles.startDateContainer}>
            <Text
              style={[styles.whiteText, styles.boldText, styles.textSize16]}
            >
              Start date
            </Text>
            <View style={styles.startDate}>
              <Text style={[styles.whiteText, styles.textSize16]}>
                {getCurrentFormattedDate()}
              </Text>
            </View>
          </View>
          <ChallengeTypeButtons
            width={width}
            activeIndex={activeChallengeTypeButtonIndex}
            setActiveIndex={setActiveChallengeTypeButtonIndex}
          />
          <ChallengeConfiguration
            activeIndex={activeChallengeTypeButtonIndex}
            ref={ChallengeConfigurationRef}
          />
          <Text
            style={[
              common.boldText,
              common.whiteText,
              common.normalSizeText,
              {alignSelf: "flex-start", marginBottom: 10},
            ]}
          >
            Stakes
          </Text>
          <TouchableOpacity
            style={styles.buyInButton}
            onPress={() => setBuyInModalVisible((prev) => !prev)}
            activeOpacity={0.8}
          >
            <Text
              style={[common.whiteText, common.normalSizeText, common.boldText]}
            >
              Buy-In
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 3,
              }}
            >
              <Text style={common.whiteNormalBoldText}>{buyInAmount}</Text>
              <Coin />
            </View>
          </TouchableOpacity>
          <TextInputModal
            title="Buy In"
            visible={buyInModalVisible}
            changeValue={buyInAmount}
            setChangeValue={setBuyInAmount}
            keyboardType="numeric"
            setVisible={setBuyInModalVisible}
            onClose={() => setBuyInModalVisible(false)}
          >
            <Text>
              Enter the amount each participant needs to contribute to join the
              challenge. This buy-in forms the prize pool.
            </Text>
          </TextInputModal>
          <TouchableOpacity
            style={styles.createChallengeButton}
            activeOpacity={0.9}
            onPress={handleCreatePress}
          >
            <Text style={common.whiteNormalText}>Create</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
