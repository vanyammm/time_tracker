import React, {useEffect, useRef, useState} from "react";
import {
  View,
  Modal,
  Text,
  Button,
  TouchableHighlight,
  SafeAreaView,
} from "react-native";
import {common} from "../../theme/commonStyles";
import {styles} from "./styles";
import {Confetti} from "../../assets/lottie/Confetti";
import {CircleXMark} from "../../assets/svg/CircleXMark";
import {ArcProgressBar} from "../ArcProgressBar/ArcProgressBar";
import {COLORS} from "../../theme/colors";
import {formatProgressTime} from "../../utils/utils";
import {
  ChallengesIdListHandle,
  GroupedChallengesList,
} from "./GroupedChallengesList";
import {UIButton} from "../UIButton/UIButton";
import {useAddProgressMutation} from "../../store/api/apiSlice";
import {useUserStore} from "../../store/userStore";

interface FocusEndModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  secondsPassed: number;
  setSecondsPassed: React.Dispatch<React.SetStateAction<number>>;
}

export const FocusEndModal: React.FC<FocusEndModalProps> = ({
  visible,
  setVisible,
  secondsPassed,
  setSecondsPassed,
}) => {
  const [showAnim, setShowAnim] = useState(false);
  const SelectedChallengesRef = useRef<ChallengesIdListHandle>(null);

  const currentUser = useUserStore((state) => state.user);
  const [addProgress, {isLoading, isError, error}] = useAddProgressMutation();

  useEffect(() => {
    if (visible) {
      setShowAnim(true);
    }
  }, [visible]);

  const handleCloseModal = () => {
    setSecondsPassed(0);
    setVisible(false);
  };

  const handleSaveResults = async () => {
    const selectedChallenges =
      SelectedChallengesRef.current?.getChallengesIdListState();

    if (selectedChallenges && currentUser) {
      console.log(
        "[FocusEndModal]: Saving. Selected challenges: ",
        selectedChallenges,
      );
      try {
        await addProgress({
          userId: currentUser!.id,
          challengeIds: selectedChallenges,
          secondsToAdd: secondsPassed,
        }).unwrap();

        console.log("PROGRESS SAVED!");
        handleCloseModal();
      } catch (error: any) {
        console.error("failed to add progress", error);
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={[styles.modal]}>
        <TouchableHighlight
          style={[styles.closeModalButton]}
          onPress={handleCloseModal}
        >
          <CircleXMark />
        </TouchableHighlight>
        {/* <Button title="close modal" onPress={() => setVisible(false)} /> */}
        <Text style={[common.grayHugeBoldText]}>Warming up?</Text>
        <ArcProgressBar progress={0.74} width={247} strokeWidth={21} />
        <Text
          style={[
            common.grayHugeBoldText,
            {textAlign: "center", marginBottom: 25},
          ]}
        >
          You completed{" "}
          <Text style={{color: "white"}}>
            {formatProgressTime(secondsPassed)}
          </Text>{" "}
          of <Text style={{color: "white"}}>Focus</Text> and earned{" "}
          <Text style={{color: "white"}}>0</Text> coins.
        </Text>
        <View
          style={{
            width: "90%",
            height: 1,
            backgroundColor: COLORS.lightDarkBlue,
            marginBottom: 20,
          }}
        />
        <Text
          style={[
            common.grayBigBoldText,
            {alignSelf: "flex-start", marginLeft: 10, marginBottom: 15},
          ]}
        >
          Challenges worked on
        </Text>
        <View style={{flex: 1}}>
          <GroupedChallengesList ref={SelectedChallengesRef} />
        </View>
        <UIButton
          style={{
            paddingHorizontal: 78,
            paddingVertical: 18,
            borderRadius: 20,
            marginBottom: 10,
          }}
          onPress={handleSaveResults}
        >
          <Text style={[common.whiteBiggerSemiBoldText]}>Save</Text>
        </UIButton>
        <Button title="Discard" color={COLORS.red} />
        {showAnim && <Confetti onFinish={() => setShowAnim(false)} />}
      </SafeAreaView>
    </Modal>
  );
};
