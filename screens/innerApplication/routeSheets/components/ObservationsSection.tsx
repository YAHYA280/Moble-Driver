import React from "react";
import { Platform, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Input } from "../../../../shared/components/ui/Input";

interface ObservationsSectionProps {
  observations: string;
  onObservationsChange: (value: string) => void;
  style?: ViewStyle;
}

export const ObservationsSection: React.FC<ObservationsSectionProps> = ({
  observations,
  onObservationsChange,
  style,
}) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    label: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 8,
      fontWeight: "500",
    },
  });

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Observations</Text>
      <Text style={styles.label}>Observation</Text>
      <Input
        value={observations}
        onChangeText={onObservationsChange}
        placeholder="Tapez un texte ici"
        multiline
        numberOfLines={4}
        style={{ minHeight: 100 }}
        returnKeyType="done"
        blurOnSubmit={true}
      />
    </View>
  );
};
