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

  // Переносимо точку в систему координат де центр стрілки в (0,0)
  const translatedX = x - CENTER_X;
  const translatedY = y - CENTER_Y;

  // Повертаємо точку на зворотний кут
  const cosAngle = Math.cos(-angle);
  const sinAngle = Math.sin(-angle);
  const rotatedX = translatedX * cosAngle - translatedY * sinAngle;
  const rotatedY = translatedX * sinAngle + translatedY * cosAngle;

  // Перевіряємо чи знаходиться точка в межах стрілки
  const arrowLeft = -ARROW_WIDTH / 2;
  const arrowRight = ARROW_WIDTH / 2;
  const arrowTop = -ARROW_HEIGHT;
  const arrowBottom = 0;

  // Додаємо трохи запасу для зручності дотику (touch area padding)
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
  const onboardingContext = onboarding ? useOnboardingData() : null;
  const setDailyGoalMinutes = onboardingContext?.setDailyGoalMinutes;
  const initialTotalMinutes = 45;

  const totalLogicalMinutes = useSharedValue(initialTotalMinutes);
  const initialAngle =
    (initialTotalMinutes % MINUTES_IN_HOUR) * RADIANS_PER_MINUTE;

  useEffect(() => {
    if (onboardingContext && setDailyGoalMinutes) {
      setDailyGoalMinutes(String(totalLogicalMinutes.value));
    }
  }, []);

  const visualAngle = useSharedValue(initialAngle);

  const previousTouchAngle = useSharedValue(initialAngle);
  const isArrowTouch = useSharedValue(false);

  const [displayTime, setDisplayTime] = useState(() => {
    const hours = Math.floor(initialTotalMinutes / MINUTES_IN_HOUR);
    const minutes = initialTotalMinutes % MINUTES_IN_HOUR;
    return {hours, minutes};
  });

  const updateDisplayTime = useCallback((hours: number, minutes: number) => {
    setDisplayTime({hours, minutes});
  }, []);

  const gesture = Gesture.Pan()

    .onTouchesDown((event, stateManager) => {
      const isOnArrow = isPointInArrow(
        event.allTouches[0].x,
        event.allTouches[0].y,
        visualAngle.value,
      );
      if (isOnArrow) {
        isArrowTouch.value = true;
      } else {
        isArrowTouch.value = false;
        stateManager.fail(); // Якщо не на стрілці, відхиляємо жест
      }
    })
    .onBegin((event) => {
      const isOnArrow = isPointInArrow(event.x, event.y, visualAngle.value);
      isArrowTouch.value = isOnArrow;

      if (!isOnArrow) {
        // Якщо дотик не на стрілці, не обробляємо жест
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

  const rotationTransform = useDerivedValue(() => {
    return [{rotate: visualAngle.value}];
  }, [visualAngle]);

  const endTimeString = useMemo(() => {
    const now = new Date(); // Беремо поточний час

    // Створюємо копію поточної дати, щоб додати до неї тривалість таймера
    const endTime = new Date(now.getTime());
    endTime.setHours(endTime.getHours() + displayTime.hours);
    endTime.setMinutes(endTime.getMinutes() + displayTime.minutes);

    // Функція-хелпер для форматування часу в "HH:MM"
    const formatTime = (date: Date) => {
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    return `${formatTime(now)} - ${formatTime(endTime)}`;
  }, [displayTime]);

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
        ).padStart(2, "0")}`}{" "}
        : 00
      </Text>
      {!onboarding && (
        <Text style={[common.normalSizeText, {color: COLORS.lightGray}]}>
          {endTimeString}
        </Text>
      )}
    </View>
  );
};
