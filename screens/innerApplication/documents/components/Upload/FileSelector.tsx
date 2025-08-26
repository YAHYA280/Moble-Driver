import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { useThemeColors } from "../../../../../hooks/useTheme";

interface FileSelectorProps {
  onFileSelect: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export const FileSelector: React.FC<FileSelectorProps> = ({
  onFileSelect,
  style,
  disabled = false,
}) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      borderRadius: 12,
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: disabled ? colors.textTertiary : colors.primary,
      backgroundColor: disabled
        ? colors.textTertiary + "10"
        : colors.primary + "10",
      opacity: disabled ? 0.6 : 1,
    },
    icon: {
      marginRight: 12,
    },
    text: {
      fontSize: 16,
      fontWeight: "600",
      color: disabled ? colors.textTertiary : colors.primary,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onFileSelect}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <FontAwesome
        name="cloud-upload"
        size={24}
        color={disabled ? colors.textTertiary : colors.primary}
        style={styles.icon}
      />
      <Text style={styles.text}>Sélectionner un fichier</Text>
    </TouchableOpacity>
  );
};
