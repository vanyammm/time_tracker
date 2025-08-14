import {use, useEffect, useRef, useState} from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  FlatList,
  Platform,
} from "react-native";
import {ChallengeTypeButtons, challengeTypes} from "./ChallengeTypeButtons";
import {
  ChallengeConfiguration,
  ChallengeConfigurationHandle,
} from "./ChallengeConfiguration";
import {TextInputModal} from "../../components/TextInputModal/TextInputModal";
import {common} from "../../theme/commonStyles";
import {Coin} from "../../../assets/Coin";
import {
  useCreateChallengeMutation,
  useSendChallengeInviteMutation,
} from "../../store/api/apiSlice";
import {useUserStore} from "../../store/userStore";
import {CirclePlusFilled} from "../../assets/svg/CirclePlusFilled";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack";
import {styles} from "./styles";
import {Participant} from "../ChallengeDetailsScreen/Participant";
import {useChallengeCreationStore} from "../../store/challengeCreationStore";
import {ChallengeCreationStackParamList} from "../../navigation/ChallengeCreationNavigator";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {useOnboardingActions} from "../../store/onboardingStore";
import {COLORS} from "../../theme/colors";

type ModalNavigationProp = StackNavigationProp<ChallengeCreationStackParamList>;
type ModalRouteProp = RouteProp<
  ChallengeCreationStackParamList,
  "ChallengeCreateModal"
>;

export const ChallengeCreateModalScreen: React.FC = () => {
  const navigation = useNavigation<ModalNavigationProp>();
  const route = useRoute<ModalRouteProp>();

  const {onboarding} = route.params;
  const {setCreatedChallengeId} = useOnboardingActions();

  const {selectedFriends, clear: clearSelection} = useChallengeCreationStore();

  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const ChallengeConfigurationRef = useRef<ChallengeConfigurationHandle>(null);

  const [createChallenge, {isLoading, isError, error}] =
    useCreateChallengeMutation();
  const [sendChallengeInvite] = useSendChallengeInviteMutation();
  const currentUser = useUserStore((state) => state.user);

  const [activeChallengeTypeButtonIndex, setActiveChallengeTypeButtonIndex] =
    useState(0);
  const challengeType = challengeTypes[activeChallengeTypeButtonIndex];
  const [buyInAmount, setBuyInAmount] = useState("100");
  const [buyInModalVisible, setBuyInModalVisible] = useState(false);

  const handleCloseModal = () => {
    clearSelection();
    navigation.goBack();
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
              challengeType !== "Race" ? parseInt(daysAmount, 10) : undefined,
            action: focusTitle,
            type: challengeType,
            buyIn: parseInt(buyInAmount, 10),
            startDate: startDate,
          },
        }).unwrap();
        if (onboarding) {
          if (setCreatedChallengeId) {
            setCreatedChallengeId(newChallenge.id);
          }
        }
        if (selectedFriends.length) {
          for (const friend of selectedFriends) {
            try {
              await sendChallengeInvite({
                challengeId: newChallenge.id,
                senderId: currentUser.id,
                receiverId: friend.id,
              }).unwrap();
            } catch (error: any) {
              console.error(`failed to invite ${friend.username}`, error);
            }
          }
        }
      } catch (error) {
        console.error("Error creating challenge:", error);
      }

      handleCloseModal();
    }
  };

  const handleAddParticipantsPress = () => {
    if (currentUser) {
      navigation.navigate("SelectFriends", {
        userId: currentUser.id,
      });
    }
  };

  const onStartDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleShowDatePicker = () => {
    setShowDatePicker(true);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.darkBlue}}>
      <View style={styles.modalOverlay}>
        <Text style={styles.modalHeaderText}>New Challenge</Text>
        <View style={styles.startDateContainer}>
          <Text style={[styles.whiteText, styles.boldText, styles.textSize16]}>
            Start date
          </Text>
          <DateTimePicker
            testID="dateTimePicker"
            value={startDate}
            mode="date"
            is24Hour={true}
            display={"default"}
            onChange={onStartDateChange}
            textColor="white"
            themeVariant="dark"
            minimumDate={new Date()}
          />
        </View>
        <ChallengeTypeButtons
          activeIndex={activeChallengeTypeButtonIndex}
          setActiveIndex={setActiveChallengeTypeButtonIndex}
        />
        <ChallengeConfiguration
          activeIndex={activeChallengeTypeButtonIndex}
          ref={ChallengeConfigurationRef}
        />
        {!onboarding && (
          <View style={{marginBottom: 10}}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text
                style={[
                  common.whiteNormalBoldText,
                  {alignSelf: "flex-start", fontWeight: 700},
                ]}
              >
                Participants
              </Text>
              <Pressable onPress={handleAddParticipantsPress}>
                <CirclePlusFilled width={19} height={19} fill="white" />
              </Pressable>
            </View>
            <View>
              {selectedFriends && currentUser && (
                <FlatList
                  data={[
                    {
                      id: currentUser.id,
                      username: currentUser.username,
                      coins: currentUser.coins,
                      avatarGradient: currentUser.avatarGradient,
                    },
                    ...selectedFriends,
                  ]}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({item}) => (
                    <Participant
                      challengeCreateModal
                      username={item.username}
                      coins={item.coins}
                      gradientColors={item.avatarGradient}
                    />
                  )}
                  ItemSeparatorComponent={() => <View style={{height: 4}} />}
                />
              )}
            </View>
          </View>
        )}
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
          <Text style={common.whiteBigSemiBoldText}>Create</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
