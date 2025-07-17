// screens/innerApplication/profile/components/StatusSelectorSection.tsx
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useThemeColors } from "../../../../../hooks/useTheme";

interface StatusSelectorSectionProps {
  status: string;
  onPress: () => void;
}

export const StatusSelectorSection: React.FC<StatusSelectorSectionProps> = ({
  status,
  onPress,
}) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      marginBottom: 16, // Reduced from 24 to 16
    },
    statusLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginBottom: 8,
    },
    statusButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.input,
      minHeight: 48,
    },
    statusText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.statusLabel}>Statut</Text>
      <TouchableOpacity
        style={styles.statusButton}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={styles.statusText}>{status}</Text>
        <FontAwesome
          name="chevron-down"
          size={14}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
};
