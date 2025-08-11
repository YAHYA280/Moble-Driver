// screens/innerApplication/routeSheets/components/RouteSheetStats.tsx

import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { RouteSheet } from "../../../../shared/types/routeSheet";

interface RouteSheetStatsProps {
  routeSheet: RouteSheet;
}

export const RouteSheetStats: React.FC<RouteSheetStatsProps> = ({
  routeSheet,
}) => {
  const colors = useThemeColors();

  const activeTimeSlots = routeSheet.days.reduce((total, day) => {
    return total + day.timeSlots.filter((slot) => slot.isActive).length;
  }, 0);

  const completedDays = routeSheet.days.filter((day) => day.isCompleted).length;
  const totalDays = routeSheet.days.length;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
      textAlign: "center",
    },
    statsGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    statItem: {
      alignItems: "center",
      flex: 1,
    },
    statValue: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center",
    },
    progressSection: {
      marginTop: 8,
    },
    progressLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
      textAlign: "center",
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.success,
      borderRadius: 4,
    },
    progressText: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 8,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistiques</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{routeSheet.totalKilometrage}</Text>
          <Text style={styles.statLabel}>Kilomètres{"\n"}total</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{completedDays}</Text>
          <Text style={styles.statLabel}>Jours{"\n"}saisis</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{activeTimeSlots}</Text>
          <Text style={styles.statLabel}>Créneaux{"\n"}actifs</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalDays}</Text>
          <Text style={styles.statLabel}>Jours{"\n"}total</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>Progression du mois</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${routeSheet.completionPercentage}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {routeSheet.completionPercentage}% des jours complétés
        </Text>
      </View>
    </View>
  );
};
