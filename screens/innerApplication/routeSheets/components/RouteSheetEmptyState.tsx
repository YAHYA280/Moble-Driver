// screens/innerApplication/routeSheets/components/RouteSheetEmptyState.tsx

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Button } from "../../../../shared/components/ui/Button";

interface RouteSheetEmptyStateProps {
  onCreateNew: () => void;
}

export const RouteSheetEmptyState: React.FC<RouteSheetEmptyStateProps> = ({
  onCreateNew,
}) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
      paddingHorizontal: 32,
    },
    icon: {
      fontSize: 64,
      marginBottom: 24,
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 32,
    },
    button: {
      paddingHorizontal: 32,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📋</Text>
      <Text style={styles.title}>Aucune feuille de route</Text>
      <Text style={styles.subtitle}>
        Commencez par créer votre première feuille de route pour le mois en
        cours.
      </Text>
      <Button
        title="Créer ma première feuille"
        onPress={onCreateNew}
        style={styles.button}
      />
    </View>
  );
};
