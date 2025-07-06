// shared/components/ui/Input.tsx - Updated with complete theme support
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../../../hooks/useTheme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
  showPasswordToggle?: boolean;
  rightIcon?: string;
  onRightIconPress?: () => void;
  variant?: "default" | "outlined" | "filled";
  size?: "small" | "medium" | "large";
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  isPassword = false,
  showPasswordToggle = false,
  rightIcon,
  onRightIconPress,
  style,
  variant = "default",
  size = "medium",
  helperText,
  required = false,
  disabled = false,
  ...props
}) => {
  const colors = useThemeColors();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  // Animation values
  const borderColorAnim = useRef(new Animated.Value(0)).current;
  const labelScaleAnim = useRef(new Animated.Value(0)).current;

  // Get size configuration
  const getSizeConfig = () => {
    switch (size) {
      case "small":
        return {
          height: 40,
          fontSize: 13,
          paddingHorizontal: 12,
          labelFontSize: 11,
        };
      case "large":
        return {
          height: 52,
          fontSize: 16,
          paddingHorizontal: 16,
          labelFontSize: 14,
        };
      default: // medium
        return {
          height: 46,
          fontSize: 14,
          paddingHorizontal: 14,
          labelFontSize: 12,
        };
    }
  };

  const sizeConfig = getSizeConfig();

  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case "outlined":
        return {
          backgroundColor: "transparent",
          borderWidth: 1.5,
          borderColor: error
            ? colors.error
            : isFocused
            ? colors.inputBorderFocused
            : colors.inputBorder,
        };
      case "filled":
        return {
          backgroundColor: colors.surfaceSecondary,
          borderWidth: 0,
          borderBottomWidth: 2,
          borderBottomColor: error
            ? colors.error
            : isFocused
            ? colors.inputBorderFocused
            : colors.inputBorder,
          borderRadius: 8,
        };
      default: // default
        return {
          backgroundColor: colors.input,
          borderWidth: 1.5,
          borderColor: error
            ? colors.error
            : isFocused
            ? colors.inputBorderFocused
            : colors.inputBorder,
        };
    }
  };

  // Animate on focus/blur
  useEffect(() => {
    Animated.parallel([
      Animated.timing(borderColorAnim, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(labelScaleAnim, {
        toValue: isFocused || props.value ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused, props.value]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  // Interpolate border color
  const animatedBorderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.inputBorder, colors.inputBorderFocused],
  });

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    labelContainer: {
      marginBottom: 4,
    },
    label: {
      fontSize: sizeConfig.labelFontSize,
      color: error
        ? colors.error
        : isFocused
        ? colors.primary
        : colors.textSecondary,
      fontWeight: isFocused ? "600" : "500",
    },
    required: {
      color: colors.error,
      marginLeft: 2,
    },
    inputContainer: {
      position: "relative",
      borderRadius: variant === "filled" ? 8 : 10,
      ...getVariantStyles(),
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: isFocused
            ? colors.isDark
              ? 0.3
              : 0.1
            : colors.isDark
            ? 0.2
            : 0.05,
          shadowRadius: isFocused ? 6 : 4,
        },
        android: {
          elevation: isFocused ? 4 : 2,
        },
        web: {
          boxShadow: isFocused
            ? colors.isDark
              ? "0 2px 6px rgba(0, 0, 0, 0.3)"
              : "0 2px 6px rgba(0, 0, 0, 0.1)"
            : colors.isDark
            ? "0 2px 4px rgba(0, 0, 0, 0.2)"
            : "0 2px 4px rgba(0, 0, 0, 0.05)",
        },
      }),
    },
    input: {
      height: sizeConfig.height,
      backgroundColor: "transparent",
      borderRadius: variant === "filled" ? 8 : 10,
      paddingHorizontal: sizeConfig.paddingHorizontal,
      fontSize: sizeConfig.fontSize,
      color: disabled ? colors.textDisabled : colors.text,
      borderWidth: 0,
    },
    inputWithIcon: {
      paddingRight: 45,
    },
    inputDisabled: {
      opacity: 0.6,
    },
    iconButton: {
      position: "absolute",
      right: 8,
      top: (sizeConfig.height - 30) / 2,
      width: 30,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 15,
    },
    helperText: {
      fontSize: sizeConfig.labelFontSize - 1,
      color: colors.textTertiary,
      marginTop: 4,
      marginLeft: 2,
    },
    errorText: {
      fontSize: sizeConfig.labelFontSize - 1,
      color: colors.error,
      marginTop: 4,
      marginLeft: 2,
    },
    floatingLabel: {
      position: "absolute",
      left: sizeConfig.paddingHorizontal,
      backgroundColor: colors.input,
      paddingHorizontal: 4,
      zIndex: 1,
    },
  });

  const renderIcon = () => {
    if (showPasswordToggle) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowPassword(!showPassword)}
          disabled={disabled}
        >
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={16}
            color={isFocused ? colors.primary : colors.iconSecondary}
          />
        </TouchableOpacity>
      );
    }

    if (rightIcon) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onRightIconPress}
          disabled={disabled}
        >
          <Ionicons
            name={rightIcon as any}
            size={16}
            color={isFocused ? colors.primary : colors.iconSecondary}
          />
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}

      {/* Input Container */}
      <Animated.View
        style={[
          styles.inputContainer,
          variant === "outlined" && {
            borderColor: animatedBorderColor,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            (showPasswordToggle || rightIcon) && styles.inputWithIcon,
            disabled && styles.inputDisabled,
            style,
          ]}
          secureTextEntry={isPassword && !showPassword}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={colors.inputPlaceholder}
          editable={!disabled}
          selectTextOnFocus={!disabled}
          {...props}
        />
        {renderIcon()}
      </Animated.View>

      {/* Helper Text or Error */}
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};
