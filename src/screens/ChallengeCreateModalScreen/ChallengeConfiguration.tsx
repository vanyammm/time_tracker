import {View, Text, TextInput, TouchableOpacity} from "react-native";
import {forwardRef, useImperativeHandle, useState} from "react";
import {challengeTypes} from "./ChallengeTypeButtons";
import Animated, {FadeIn, FadeOut} from "react-native-reanimated";
import {TextInputModal} from "../../components/TextInputModal/TextInputModal";
import {common} from "../../theme/commonStyles";
import {styles} from "./styles";

interface ChallengeConfigurationProps {
  activeIndex: number;
  challengeCard?: boolean;
  focusTitleData?: string;
  hoursAmountData?: string;
  daysAmountData?: string;
}

type ChallengeConfigurationState = {
  focusTitle: string;
  hoursAmount: string;
  daysAmount: string;
};

export type ChallengeConfigurationHandle = {
  getChallengeConfigurationState: () => ChallengeConfigurationState;
};

export const ChallengeConfiguration = forwardRef<
  ChallengeConfigurationHandle,
  ChallengeConfigurationProps
>(
  (
    {
      activeIndex,
      challengeCard,
      focusTitleData,
      hoursAmountData,
      daysAmountData,
    },
    ref,
  ) => {
    const activeChallengeType = challengeTypes[activeIndex];

    const [focusTitle, setFocusTitle] = useState("Focus");
    const [hoursAmount, setHoursAmount] = useState("40");
    const [daysAmount, setDaysAmount] = useState("7");

    useImperativeHandle(ref, () => ({
      getChallengeConfigurationState: () => ({
        focusTitle: focusTitle,
        hoursAmount: hoursAmount,
        daysAmount: daysAmount,
      }),
    }));

    const [focusTitleModalVisible, setFocusTitleModalVisible] = useState(false);
    const [hoursAmountModalVisible, setHoursAmountModalVisible] =
      useState(false);
    const [daysAmountModalVisible, setDaysAmountModalVisible] = useState(false);

    return (
      <View style={{marginBottom: 15}}>
        <Animated.View
          style={[styles.challengeConfigurationContainer]}
          entering={FadeIn.duration(250)}
          exiting={FadeOut.duration(250)}
          key={activeChallengeType}
        >
          {(activeChallengeType === "Race" ||
            activeChallengeType === "Team") && (
            <Text style={[styles.whiteText, styles.textSize16]}>
              {activeChallengeType === "Race" && "Be first to"}
              {activeChallengeType === "Team" && "Collectively"}
            </Text>
          )}
          {challengeCard ? (
            <Text style={[common.whiteNormalBoldText]}>{focusTitleData}</Text>
          ) : (
            <TouchableOpacity
              onPress={() => setFocusTitleModalVisible((prev) => !prev)}
            >
              <TextInput
                value={focusTitle}
                editable={false}
                pointerEvents="none"
                style={[styles.textInput, {minWidth: 140}]}
              />
            </TouchableOpacity>
          )}
          <TextInputModal
            title="Activity label"
            visible={focusTitleModalVisible}
            setVisible={setFocusTitleModalVisible}
            changeValue={focusTitle}
            setChangeValue={setFocusTitle}
            onClose={() => setFocusTitleModalVisible(false)}
          >
            <Text>Rename your activity here if you want.</Text>
          </TextInputModal>
          <Text style={[styles.whiteText, styles.textSize16]}>
            {(activeChallengeType === "Regular" ||
              activeChallengeType === "Team") &&
              "a total of"}
            {activeChallengeType === "Streak" && "for"}
            {activeChallengeType === "Race" && "a total of"}
          </Text>
          {challengeCard ? (
            <Text style={[common.whiteNormalBoldText]}>{hoursAmountData}</Text>
          ) : (
            <TouchableOpacity
              onPress={() => setHoursAmountModalVisible((prev) => !prev)}
            >
              <TextInput
                value={hoursAmount}
                editable={false}
                pointerEvents="none"
                style={[styles.textInput]}
              />
            </TouchableOpacity>
          )}
          <TextInputModal
            title="Hours amount"
            keyboardType="numeric"
            visible={hoursAmountModalVisible}
            setVisible={setHoursAmountModalVisible}
            changeValue={hoursAmount}
            setChangeValue={setHoursAmount}
            onClose={() => setHoursAmountModalVisible(false)}
          >
            <Text>Change the hours goal here.</Text>
          </TextInputModal>
          <Text style={[styles.whiteText, styles.textSize16]}>
            {(activeChallengeType === "Regular" ||
              activeChallengeType === "Team") &&
              "hours in "}
            {activeChallengeType === "Streak" && "hours daily for "}
            {activeChallengeType === "Race" && "hours."}
          </Text>
          {activeChallengeType !== "Race" && (
            <>
              {challengeCard ? (
                <Text style={[common.whiteNormalBoldText]}>
                  {daysAmountData}
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={() => setDaysAmountModalVisible((prev) => !prev)}
                >
                  <TextInput
                    value={daysAmount}
                    editable={false}
                    pointerEvents="none"
                    style={[styles.textInput]}
                  />
                </TouchableOpacity>
              )}
              <TextInputModal
                title="Days amount"
                keyboardType="numeric"
                visible={daysAmountModalVisible}
                setVisible={setDaysAmountModalVisible}
                changeValue={daysAmount}
                setChangeValue={setDaysAmount}
                onClose={() => setDaysAmountModalVisible(false)}
              >
                <Text>Change the days limit here.</Text>
              </TextInputModal>
              <Text style={[styles.whiteText, styles.textSize16]}>
                {(activeChallengeType === "Regular" ||
                  activeChallengeType === "Team") &&
                  "days."}
                {activeChallengeType === "Streak" && "consecutive days."}
              </Text>
            </>
          )}
        </Animated.View>
      </View>
    );
  },
);
