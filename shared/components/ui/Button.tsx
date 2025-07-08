import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { useThemeColors } from "../../../hooks/useTheme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const colors = useThemeColors();

  const getButtonStyle = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: colors.primary,
        };
      case "secondary":
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case "danger":
        return {
          backgroundColor: colors.error,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: colors.primary,
        };
      default:
        return {
          backgroundColor: colors.primary,
        };
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "primary":
        return {
          color: "#ffffff",
        };
      case "secondary":
        return {
          color: colors.text,
        };
      case "outline":
        return {
          color: colors.primary,
        };
      default:
        return {
          color: "#ffffff",
        };
    }
  };

  const getIndicatorColor = () => {
    return variant === "primary" ? "white" : colors.primary;
  };

  const styles = StyleSheet.create({
    button: {
      height: 48,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 16,
      ...getButtonStyle(),
    },
    disabled: {
      opacity: 0.5,
    },
    text: {
      fontSize: 16,
      fontWeight: "600",
      ...getTextStyle(),
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getIndicatorColor()} />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
