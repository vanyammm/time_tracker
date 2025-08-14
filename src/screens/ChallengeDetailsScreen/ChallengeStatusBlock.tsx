import {Text, View} from "react-native";
import {ChallengeWithMyDetails} from "../../../db/schema";
import {styles} from "./styles";
import {common} from "../../theme/commonStyles";
import {COLORS} from "../../theme/colors";
import {ArcProgressBar} from "../../components/ArcProgressBar/ArcProgressBar";
import {Win} from "../../assets/svg/Win";
import {calculateDaysPassed, calculateProgressRatio} from "../../utils/utils";
import {TwoFlags} from "../../assets/svg/TwoFlags";

interface ChallengeStatusBlockProps {
  challenge: ChallengeWithMyDetails;
}

export const ChallengeStatusBlock: React.FC<ChallengeStatusBlockProps> = ({
  challenge,
}) => {
  const daysPassed = challenge
    ? calculateDaysPassed(challenge.startDate)
    : null;
  return (
    <View
      style={{
        width: "100%",
        marginBottom: challenge.status === "active" ? 0 : 40,
      }}
    >
      {challenge.status === "active" && (
        <View style={{alignItems: "center"}}>
          <View style={[styles.daysPassedBlock]}>
            <Text style={[common.whiteBigBoldText, {color: COLORS.modalBg}]}>
              Day {daysPassed}
              {challenge.daysAmount ? ` of ${challenge.daysAmount}` : ""}
            </Text>
          </View>
          <ArcProgressBar
            progress={calculateProgressRatio(
              challenge.myProgress,
              challenge.hoursAmount,
            )}
            progressInSeconds={challenge.myProgress}
            streakMode={challenge.type === "streak"}
          />
        </View>
      )}
      {challenge.status === "finished" && (
        <View style={{width: "100%", alignItems: "center"}}>
          {challenge.myStatus === "failed" ? (
            <>
              <TwoFlags fill={"red"} width={130} height={130} />
              <Text style={[common.whiteHugeText, {fontWeight: 800}]}>
                You Lost
              </Text>
            </>
          ) : (
            <>
              <Win width={110} height={110} />
              <Text style={[common.whiteHugeText, {fontWeight: 800}]}>
                You Won!
              </Text>
            </>
          )}
        </View>
      )}
    </View>
  );
};
