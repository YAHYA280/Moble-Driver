import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
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

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            error && styles.inputError,
            (showPasswordToggle || rightIcon) && styles.inputWithIcon,
            style,
          ]}
          secureTextEntry={isPassword && !showPassword}
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
              color="#81919a"
            />
          </TouchableOpacity>
        )}
        {rightIcon && (
          <TouchableOpacity style={styles.rightIcon} onPress={onRightIconPress}>
            <Ionicons name={rightIcon as any} size={16} color="#81919a" />
          </TouchableOpacity>
        )}
      </View>
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
  inputContainer: {
    position: "relative",
  },
  input: {
    height: 46,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#edf1f3",
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#212b36",
  },
  inputWithIcon: {
    paddingRight: 40,
  },
  inputError: {
    borderColor: "#ff4444",
  },
  eyeIcon: {
    position: "absolute",
    right: 13,
    top: 15,
  },
  rightIcon: {
    position: "absolute",
    right: 13,
    top: 15,
  },
  errorText: {
    fontSize: 12,
    color: "#ff4444",
    marginTop: 4,
  },
});
