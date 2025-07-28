// screens/innerApplication/planning/components/planning/ErrorSection.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../../contexts/ThemeContext";

interface ErrorSectionProps {
  error: string;
}

const styles = StyleSheet.create({
  errorContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export const ErrorSection: React.FC<ErrorSectionProps> = ({ error }) => {
  const { colors } = useTheme();

  const dynamicStyles = {
    errorContainer: {
      ...styles.errorContainer,
      backgroundColor: colors.error + "15",
      borderLeftColor: colors.error,
    },
    errorText: {
      ...styles.errorText,
      color: colors.error,
    },
  };

  return (
    <View style={dynamicStyles.errorContainer}>
      <Text style={dynamicStyles.errorText}>{error}</Text>
    </View>
  );
};
