import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";
import {common} from "../../theme/commonStyles";
import {COLORS} from "../../theme/colors";

export type MenuItem = {
  id: string;
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  isDestructive?: boolean;
};

interface OptionsMenuProps {
  items: MenuItem[];
  onClose: () => void;
  style?: StyleProp<ViewStyle>;
}

export const OptionsMenu: React.FC<OptionsMenuProps> = ({
  items,
  onClose,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              item.onPress();
              onClose();
            }}
          >
            <Text
              style={[
                common.whiteNormalText,
                styles.text,
                item.isDestructive && styles.destructiveText,
              ]}
            >
              {item.label}
            </Text>
            {item.icon}
          </TouchableOpacity>
          {index < items.length - 1 && <View style={styles.separator} />}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2E2E3E",
    borderRadius: 14,
    width: 250,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 16,
  },
  destructiveText: {
    color: COLORS.red,
  },
});
