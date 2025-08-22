import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import React from "react";
import { Platform, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { RouteSheet } from "../../../../shared/types/routeSheet";

interface RouteSheetSummaryCardProps {
  routeSheet: RouteSheet;
  style?: ViewStyle;
}

export const RouteSheetSummaryCard: React.FC<RouteSheetSummaryCardProps> = ({
  routeSheet,
  style,
}) => {
  const colors = useThemeColors();

  const getCompletedDays = () => {
    return routeSheet.days.filter((day) => day.isCompleted).length;
  };

  const getActiveDays = () => {
    return routeSheet.days.filter((day) =>
      day.timeSlots.some((slot) => slot.isActive)
    ).length;
  };

  const getTotalDaysInMonth = () => {
    return routeSheet.days.length;
  };

  const getAverageKmPerDay = () => {
    const activeDays = getActiveDays();
    if (activeDays === 0) return 0;
    return Math.round(routeSheet.totalKilometrage / activeDays);
  };

  const getLastModifiedDate = () => {
    return new Date(routeSheet.lastModified).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
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
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    statItem: {
      width: "48%",
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      alignItems: "center",
    },
    statValue: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center",
      fontWeight: "500",
    },
    progressContainer: {
      marginTop: 8,
    },
    progressLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
      fontWeight: "500",
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.backgroundTertiary,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    progressText: {
      fontSize: 12,
      color: colors.textTertiary,
      marginTop: 4,
      textAlign: "center",
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border + "30",
      marginTop: 12,
    },
    infoLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    infoValue: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "600",
    },
  });

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Résumé de la feuille de route</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{getActiveDays()}</Text>
          <Text style={styles.statLabel}>Jours avec trajets</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{routeSheet.totalKilometrage}</Text>
          <Text style={styles.statLabel}>Total km</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>{getAverageKmPerDay()}</Text>
          <Text style={styles.statLabel}>Moyenne km/jour</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
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
          {routeSheet.completionPercentage}% complété ({getCompletedDays()}/
          {getTotalDaysInMonth()} jours)
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Créée le</Text>
        <Text style={styles.infoValue}>
          {new Date(routeSheet.createdAt).toLocaleDateString("fr-FR")}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Dernière modification</Text>
        <Text style={styles.infoValue}>{getLastModifiedDate()}</Text>
      </View>

      <ConditionalComponent isValid={!!routeSheet.submittedAt}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Soumise le</Text>
          <Text style={styles.infoValue}>
            {new Date(routeSheet.submittedAt!).toLocaleDateString("fr-FR")}
          </Text>
        </View>
      </ConditionalComponent>
    </View>
  );
};
