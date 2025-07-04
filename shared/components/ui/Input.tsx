import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
  showPasswordToggle?: boolean;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  isPassword = false,
  showPasswordToggle = false,
  rightIcon,
  onRightIconPress,
  style,
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  // Animation values - only border color
  const borderColorAnim = useRef(new Animated.Value(0)).current;

  // Animate on focus/blur - only border color
  useEffect(() => {
    Animated.timing(borderColorAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  // Interpolate border color only
  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#edf1f3", "#746cd4"],
  });

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, isFocused && styles.labelFocused]}>
          {label}
        </Text>
      )}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor: borderColor,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            error && styles.inputError,
            (showPasswordToggle || rightIcon) && styles.inputWithIcon,
            style,
          ]}
          secureTextEntry={isPassword && !showPassword}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={16}
              color={isFocused ? "#746cd4" : "#81919a"}
            />
          </TouchableOpacity>
        )}
        {rightIcon && (
          <TouchableOpacity style={styles.rightIcon} onPress={onRightIconPress}>
            <Ionicons
              name={rightIcon as any}
              size={16}
              color={isFocused ? "#746cd4" : "#81919a"}
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: "#81919a",
    fontWeight: "500",
    marginBottom: 4,
  },
  labelFocused: {
    color: "#746cd4",
    fontWeight: "600",
  },
  inputContainer: {
    position: "relative",
    borderRadius: 10,
    borderWidth: 1.5,
    backgroundColor: "white",
    shadowColor: "#746cd4",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    height: 46,
    backgroundColor: "transparent",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#212b36",
    borderWidth: 0, // Remove default border since container handles it
  },
  inputWithIcon: {
    paddingRight: 45, // Increased from 40 to accommodate larger touch area
  },
  inputError: {
    borderColor: "#ff4444",
  },
  eyeIcon: {
    position: "absolute",
    right: 8,
    top: 8,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    // Add visual feedback for better UX
    borderRadius: 15,
  },
  rightIcon: {
    position: "absolute",
    right: 8,
    top: 8,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  errorText: {
    fontSize: 12,
    color: "#ff4444",
    marginTop: 4,
  },
});
