// shared/components/ui/Checkbox.tsx - Updated with theme support
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useThemeColors } from "../../../hooks/useTheme";

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: string;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  variant?: "default" | "rounded";
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  label,
  disabled = false,
  size = "medium",
  variant = "default",
}) => {
  const colors = useThemeColors();

  const getSizeConfig = () => {
    switch (size) {
      case "small":
        return {
          width: 16,
          height: 16,
          iconSize: 10,
          fontSize: 11,
          borderRadius: variant === "rounded" ? 8 : 3,
        };
      case "large":
        return {
          width: 24,
          height: 24,
          iconSize: 16,
          fontSize: 14,
          borderRadius: variant === "rounded" ? 12 : 6,
        };
      default: // medium
        return {
          width: 19,
          height: 19,
          iconSize: 12,
          fontSize: 12,
          borderRadius: variant === "rounded" ? 9.5 : 4,
        };
    }
  };

  const sizeConfig = getSizeConfig();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      opacity: disabled ? 0.5 : 1,
    },
    checkbox: {
      width: sizeConfig.width,
      height: sizeConfig.height,
      borderRadius: sizeConfig.borderRadius,
      borderWidth: 1.5,
      borderColor: checked
        ? colors.primary
        : colors.isDark
        ? colors.borderLight
        : colors.textSecondary,
      backgroundColor: checked ? colors.primary : "transparent",
      marginRight: label ? 8 : 0,
      justifyContent: "center",
      alignItems: "center",
      // Add subtle transition effect
      shadowColor: checked ? colors.primary : "transparent",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: checked ? 0.2 : 0,
      shadowRadius: 2,
      elevation: checked ? 1 : 0,
    },
    label: {
      fontSize: sizeConfig.fontSize,
      color: colors.textSecondary,
      fontWeight: "500",
      flex: 1,
    },
    pressable: {
      // Add some padding for better touch target
      paddingVertical: 4,
      paddingHorizontal: 2,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.container, styles.pressable]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.checkbox}>
        {checked && (
          <Ionicons name="checkmark" size={sizeConfig.iconSize} color="white" />
        )}
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};
