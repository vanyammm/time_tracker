import React, {useCallback, useState, useMemo, useEffect} from "react";
import {
  Canvas,
  Group,
  RoundedRect,
  BlurMask,
  Circle,
  rotate,
} from "@shopify/react-native-skia";
import {Dimensions, View, Text} from "react-native";
import {
  useSharedValue,
  useDerivedValue,
  runOnJS,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import {GestureDetector, Gesture} from "react-native-gesture-handler";
import {common} from "../../theme/commonStyles";
import {COLORS} from "../../theme/colors";
import {useOnboardingData} from "../../context/OnboardingContext";
import {useTimerActions, useTimerStore} from "../../store/timerStore";

const {width} = Dimensions.get("window");
const SIZE = (width - 45) / 1.4;
const CENTER_X = SIZE / 2;
const CENTER_Y = SIZE / 2;
const RADIUS = SIZE / 2 - 20;
const TICK_COUNT = 60;
const ARROW_HEIGHT = 77;
const ARROW_WIDTH = 6;
const MINUTES_IN_HOUR = 60;
const SNAP_INTERVAL = 5;
const FULL_CIRCLE_RADIANS = 2 * Math.PI;
const RADIANS_PER_MINUTE = FULL_CIRCLE_RADIANS / MINUTES_IN_HOUR;
const SNAP_ANIMATION_DURATION = 250;

const ClockTickMarks = React.memo(() => {
  const ticks = Array.from({length: TICK_COUNT}, (_, i) => i);
  return (
    <>
      {ticks.map((_, index) => {
        const angleRadians = (index * FULL_CIRCLE_RADIANS) / TICK_COUNT;
        const isHourMark = index % SNAP_INTERVAL === 0;
        const tickLength = isHourMark ? 16 : 8;
        const tickWidth = isHourMark ? 5 : 3;

        return (
          <Group
            key={index}
            transform={[
              {translateX: CENTER_X},
              {translateY: CENTER_Y},
              {rotate: angleRadians},
            ]}
          >
            <RoundedRect
              x={-tickWidth / 2}
              y={-RADIUS}
              width={tickWidth}
              height={tickLength}
              color="white"
              r={tickWidth / 2}
            >
              {isHourMark && <BlurMask blur={4} style="solid" />}
            </RoundedRect>
          </Group>
        );
      })}
      <Circle cy={CENTER_Y} cx={CENTER_X} r={7} color="white">
        <BlurMask blur={4} style="solid" />
      </Circle>
    </>
  );
});

const isPointInArrow = (x: number, y: number, angle: number): boolean => {
  "worklet";

  const translatedX = x - CENTER_X;
  const translatedY = y - CENTER_Y;

  const cosAngle = Math.cos(-angle);
  const sinAngle = Math.sin(-angle);
  const rotatedX = translatedX * cosAngle - translatedY * sinAngle;
  const rotatedY = translatedX * sinAngle + translatedY * cosAngle;

  const arrowLeft = -ARROW_WIDTH / 2;
  const arrowRight = ARROW_WIDTH / 2;
  const arrowTop = -ARROW_HEIGHT;
  const arrowBottom = 0;

  const touchPadding = 15;

  return (
    rotatedX >= arrowLeft - touchPadding &&
    rotatedX <= arrowRight + touchPadding &&
    rotatedY >= arrowTop - touchPadding &&
    rotatedY <= arrowBottom + touchPadding
  );
};

interface TimerProps {
  onboarding?: boolean;
}

export const Timer: React.FC<TimerProps> = ({onboarding}) => {
  const {status, remainingSeconds, durationSeconds} = useTimerStore();
  const {setDuration} = useTimerActions();

  const onboardingContext = onboarding ? useOnboardingData() : null;
  const setDailyGoalMinutes = onboardingContext?.setDailyGoalMinutes;
  // const initialTotalMinutes = 45;
  const initialMinutes = useTimerStore.getState().durationSeconds / 60;

  const totalLogicalMinutes = useSharedValue(initialMinutes);
  const initialAngle = (initialMinutes % MINUTES_IN_HOUR) * RADIANS_PER_MINUTE;
  const visualAngle = useSharedValue(initialAngle);
  const previousTouchAngle = useSharedValue(initialAngle);
  const isArrowTouch = useSharedValue(false);

  const [displayTime, setDisplayTime] = useState(() => {
    const hours = Math.floor(initialMinutes / MINUTES_IN_HOUR);
    const minutes = initialMinutes % MINUTES_IN_HOUR;
    return {hours, minutes};
  });

  const updateDisplayTime = useCallback((hours: number, minutes: number) => {
    setDisplayTime({hours, minutes});
  }, []);

  const rotationTransform = useDerivedValue(() => {
    if (status === "running" || status === "paused") {
      const totalMinutesLeft = remainingSeconds / 60;
      const angle = (totalMinutesLeft % MINUTES_IN_HOUR) * RADIANS_PER_MINUTE;

      return [{rotate: angle}];
    }

    return [{rotate: visualAngle.value}];
  }, [visualAngle, status, remainingSeconds]);

  const endTimeString = useMemo(() => {
    const now = new Date();

    const endTime = new Date(now.getTime());
    endTime.setHours(endTime.getHours() + displayTime.hours);
    endTime.setMinutes(endTime.getMinutes() + displayTime.minutes);

    const formatTime = (date: Date) => {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    return `${formatTime(now)} - ${formatTime(endTime)}`;
  }, [displayTime]);

  const secondsForDisplay =
    status === "running" || status === "paused" ? remainingSeconds % 60 : 0;

  useEffect(() => {
    if (onboardingContext && setDailyGoalMinutes) {
      setDailyGoalMinutes(String(totalLogicalMinutes.value));
    }
  }, []);

  useEffect(() => {
    if (status === "paused" || status === "running") {
      const hours = Math.floor(remainingSeconds / 3600);
      const minutes = Math.floor((remainingSeconds % 3600) / 60);

      setDisplayTime({hours, minutes});
    } else if (status === "idle") {
      const minutesFromStore = durationSeconds / 60;
      totalLogicalMinutes.value = minutesFromStore;
      setDisplayTime({
        hours: Math.floor(minutesFromStore / MINUTES_IN_HOUR),
        minutes: minutesFromStore % MINUTES_IN_HOUR,
      });
    }
  }, [remainingSeconds, status, durationSeconds]);

  const gesture = Gesture.Pan()
    .onTouchesDown((event, stateManager) => {
      if (status !== "idle") {
        stateManager.fail();
        return;
      }
      const isOnArrow = isPointInArrow(
        event.allTouches[0].x,
        event.allTouches[0].y,
        visualAngle.value,
      );
      if (isOnArrow) {
        isArrowTouch.value = true;
      } else {
        isArrowTouch.value = false;
        stateManager.fail();
      }
    })
    .onBegin((event) => {
      const isOnArrow = isPointInArrow(event.x, event.y, visualAngle.value);
      isArrowTouch.value = isOnArrow;

      if (!isOnArrow) {
        return;
      }
      cancelAnimation(visualAngle);
      const dx = event.x - CENTER_X;
      const dy = event.y - CENTER_Y;
      const currentRawAngle = Math.atan2(dy, dx);
      let currentAdjustedAngle =
        (currentRawAngle + Math.PI / 2 + FULL_CIRCLE_RADIANS) %
        FULL_CIRCLE_RADIANS;
      previousTouchAngle.value = currentAdjustedAngle;
    })
    .onUpdate((event) => {
      if (!isArrowTouch.value) {
        return;
      }
      const dx = event.x - CENTER_X;
      const dy = event.y - CENTER_Y;
      const currentRawAngle = Math.atan2(dy, dx);
      let currentAdjustedAngle =
        (currentRawAngle + Math.PI / 2 + FULL_CIRCLE_RADIANS) %
        FULL_CIRCLE_RADIANS;

      let deltaAngle = currentAdjustedAngle - previousTouchAngle.value;
      if (deltaAngle > Math.PI) {
        deltaAngle -= FULL_CIRCLE_RADIANS;
      } else if (deltaAngle < -Math.PI) {
        deltaAngle += FULL_CIRCLE_RADIANS;
      }

      const deltaMinutes = deltaAngle / RADIANS_PER_MINUTE;
      const potentialNewTotalMinutes = totalLogicalMinutes.value + deltaMinutes;
      const newTotalLogicalMinutes = Math.max(0, potentialNewTotalMinutes);

      const newVisualAngle =
        (newTotalLogicalMinutes % MINUTES_IN_HOUR) * RADIANS_PER_MINUTE;
      visualAngle.value = newVisualAngle;

      totalLogicalMinutes.value = newTotalLogicalMinutes;
      previousTouchAngle.value = currentAdjustedAngle;

      const snappedTotalMinutesForDisplay = Math.max(
        1,
        Math.round(newTotalLogicalMinutes / SNAP_INTERVAL) * SNAP_INTERVAL,
      );
      const displayHours = Math.floor(
        snappedTotalMinutesForDisplay / MINUTES_IN_HOUR,
      );
      const displayMinutes = snappedTotalMinutesForDisplay % MINUTES_IN_HOUR;

      runOnJS(updateDisplayTime)(displayHours, displayMinutes);
    })
    .onEnd(() => {
      if (!isArrowTouch.value) {
        return;
      }
      const finalLogicalMinutes = totalLogicalMinutes.value;
      const snappedTotalMinutes = Math.max(
        1,
        Math.round(finalLogicalMinutes / SNAP_INTERVAL) * SNAP_INTERVAL,
      );

      if (status === "idle") {
        const newDurationInSeconds = snappedTotalMinutes * 60;
        runOnJS(setDuration)(newDurationInSeconds);
      }

      const targetAngle =
        (snappedTotalMinutes % MINUTES_IN_HOUR) * RADIANS_PER_MINUTE;

      visualAngle.value = withTiming(
        targetAngle,
        {duration: SNAP_ANIMATION_DURATION},
        (finished) => {
          if (finished) {
            totalLogicalMinutes.value = snappedTotalMinutes;
            if (onboarding && setDailyGoalMinutes) {
              const minutesAsString = String(snappedTotalMinutes);
              runOnJS(setDailyGoalMinutes)(minutesAsString);
            }
            const finalHours = Math.floor(
              snappedTotalMinutes / MINUTES_IN_HOUR,
            );
            const finalMinutes = snappedTotalMinutes % MINUTES_IN_HOUR;
            runOnJS(updateDisplayTime)(finalHours, finalMinutes);
          }
        },
      );
    });

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <GestureDetector gesture={gesture}>
        <Canvas style={{width: SIZE, height: SIZE}}>
          <ClockTickMarks />
          <Circle cy={SIZE / 2} cx={SIZE / 2} r={7} color="white">
            <BlurMask blur={4} style="solid" />
          </Circle>
          <Group
            origin={{x: CENTER_X, y: CENTER_Y}}
            transform={rotationTransform}
          >
            <RoundedRect
              x={CENTER_X - ARROW_WIDTH / 2}
              y={CENTER_Y - ARROW_HEIGHT}
              width={ARROW_WIDTH}
              height={ARROW_HEIGHT}
              r={ARROW_WIDTH / 2}
              color="white"
            >
              <BlurMask blur={4} style="solid" />
            </RoundedRect>
          </Group>
        </Canvas>
      </GestureDetector>
      {onboarding && (
        <Text style={{color: COLORS.lightGray, fontSize: 16, marginBottom: 15}}>
          Drag the Hand to adjust
        </Text>
      )}
      <Text style={[common.whiteNormalText, {fontSize: 37, fontWeight: 800}]}>
        {`${String(displayTime.hours).padStart(2, "0")} : ${String(
          displayTime.minutes,
        ).padStart(2, "0")} : ${String(secondsForDisplay).padStart(
          2,
          "0",
        )}`}{" "}
      </Text>
      {!onboarding && (
        <Text style={[common.normalSizeText, {color: COLORS.lightGray}]}>
          {endTimeString}
        </Text>
      )}
    </View>
  );
};
