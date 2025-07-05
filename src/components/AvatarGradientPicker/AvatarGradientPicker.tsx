import React, {useState, useCallback, useMemo, useRef, useEffect} from "react";
import {View, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import {Canvas, Circle, LinearGradient, vec} from "@shopify/react-native-skia";
import convert from "color-convert";
import {useOnboardingData} from "../../context/OnboardingContext";

const {width} = Dimensions.get("window");
const SIZE = width / 2.15;
const CENTER = SIZE / 2;

// --- Пул кольорів залишається тим самим ---
const COLOR_POOL_PAIRS = [
  ["#ff7e5f", "#feb47b"],
  ["#ff9a9e", "#fecfef"],
  ["#a1c4fd", "#c2e9fb"],
  ["#84fab0", "#8fd3f4"],
  ["#f6d365", "#fda085"],
  ["#d4fc79", "#96e6a1"],
  ["#a8edea", "#fed6e3"],
  ["#e0c3fc", "#8ec5fc"],
  ["#4facfe", "#00f2fe"],
  ["#fa709a", "#fee140"],
  ["#6a11cb", "#2575fc"],
  ["#f093fb", "#f5576c"],
  ["#43e97b", "#38f9d7"],
  ["#ff5acd", "#fbda61"],
  ["#2af598", "#009efd"],
];

const UNIQUE_COLORS = Array.from(new Set(COLOR_POOL_PAIRS.flat()));
const hexToHsl = (hex: string) => convert.hex.hsl(hex.replace("#", ""));
const getHueDistance = (h1: number, h2: number) => {
  const diff = Math.abs(h1 - h2);
  return Math.min(diff, 360 - diff);
};

// --- НОВА КОНСТАНТА ---
// Кількість найближчих кольорів, з яких будемо робити випадковий вибір.
// Можете погратись з цим числом (наприклад, 3 або 5).
const HARMONIOUS_GROUP_SIZE = 4;

export const GradientAvatarShuffle = () => {
  const {setGradient} = useOnboardingData();
  const [gradientColors, setGradientColors] = useState(
    () => COLOR_POOL_PAIRS[Math.floor(Math.random() * COLOR_POOL_PAIRS.length)],
  );

  useEffect(() => {
    saveGradientToContext();
  }, []);

  const anchorIndexRef = useRef(0);

  const colorsWithHsl = useMemo(() => {
    return UNIQUE_COLORS.map((hex) => ({hex, hsl: hexToHsl(hex)}));
  }, []);

  const handleShuffle = useCallback(() => {
    const anchorColorHex = gradientColors[anchorIndexRef.current];
    const oldColorHex = gradientColors[(anchorIndexRef.current + 1) % 2];
    const [anchorHue] = hexToHsl(anchorColorHex);

    const candidates = [];
    for (const color of colorsWithHsl) {
      if (color.hex === anchorColorHex || color.hex === oldColorHex) {
        continue;
      }
      const distance = getHueDistance(anchorHue, color.hsl[0]);
      candidates.push({color, distance});
    }

    if (candidates.length === 0) return;

    // 2. Сортуємо кандидатів від найближчого до найвіддаленішого
    candidates.sort((a, b) => a.distance - b.distance);

    // 3. Беремо невелику групу найближчих (гармонійних) кольорів
    const harmoniousGroup = candidates.slice(
      0,
      Math.min(candidates.length, HARMONIOUS_GROUP_SIZE),
    );

    // 4. Випадково обираємо ОДИН колір з цієї гармонійної групи
    const chosenCandidate =
      harmoniousGroup[Math.floor(Math.random() * harmoniousGroup.length)];

    const newColorHex = chosenCandidate.color.hex;
    // --- КІНЕЦЬ ЗМІН ---

    const newGradient = [anchorColorHex, newColorHex];

    const finalGradient =
      anchorIndexRef.current === 0 ? newGradient : newGradient.reverse();
    setGradientColors(finalGradient);

    // console.log(
    //   `Kept ${anchorColorHex}, randomly chose neighbor ${newColorHex} from a group of ${harmoniousGroup.length}`,
    // );

    anchorIndexRef.current = (anchorIndexRef.current + 1) % 2;
    saveGradientToContext();
  }, [gradientColors, colorsWithHsl]);

  const saveGradientToContext = () => {
    setGradient(gradientColors);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.8} onPress={handleShuffle}>
        <Canvas style={{width: SIZE, height: SIZE}}>
          <Circle cx={CENTER} cy={CENTER} r={CENTER}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(SIZE, SIZE)}
              colors={gradientColors}
            />
          </Circle>
        </Canvas>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
