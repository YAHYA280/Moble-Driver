// screens/innerApplication/routeSheets/components/RouteSheetCard.tsx

import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { RouteSheet } from "../../../../shared/types/routeSheet";

interface RouteSheetCardProps {
  routeSheet: RouteSheet;
  onView: () => void;
  onEdit: () => void;
}

export const RouteSheetCard: React.FC<RouteSheetCardProps> = ({
  routeSheet,
  onView,
  onEdit,
}) => {
  const colors = useThemeColors();

  const getStatusColor = () => {
    switch (routeSheet.status) {
      case "draft":
        return colors.warning;
      case "submitted":
        return colors.success;
      case "archived":
        return colors.textTertiary;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusLabel = () => {
    switch (routeSheet.status) {
      case "draft":
        return "Brouillon";
      case "submitted":
        return "Soumise";
      case "archived":
        return "Archivée";
      default:
        return "Inconnu";
    }
  };

  const isCurrentMonth = () => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
    return routeSheet.month === currentMonth;
  };

  const canEdit = routeSheet.status === "draft" && isCurrentMonth();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
      borderLeftWidth: 4,
      borderLeftColor: getStatusColor(),
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
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    titleSection: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
      backgroundColor: getStatusColor(),
    },
    statusText: {
      fontSize: 12,
      fontWeight: "500",
      color: getStatusColor(),
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    statItem: {
      alignItems: "center",
    },
    statValue: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    progressContainer: {
      marginBottom: 16,
    },
    progressLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    progressBar: {
      height: 6,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 3,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: getStatusColor(),
      borderRadius: 3,
    },
    progressText: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "right",
      marginTop: 4,
    },
    actionsContainer: {
      flexDirection: "row",
      gap: 8,
    },
    actionButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      borderRadius: 8,
      gap: 6,
    },
    viewButton: {
      backgroundColor: colors.primary + "15",
      borderColor: colors.primary + "30",
      borderWidth: 1,
    },
    editButton: {
      backgroundColor: colors.success + "15",
      borderColor: colors.success + "30",
      borderWidth: 1,
    },
    disabledButton: {
      backgroundColor: colors.backgroundSecondary,
      borderColor: colors.border,
      borderWidth: 1,
      opacity: 0.6,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: "500",
    },
    viewButtonText: {
      color: colors.primary,
    },
    editButtonText: {
      color: colors.success,
    },
    disabledButtonText: {
      color: colors.textTertiary,
    },
  });

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{routeSheet.monthName}</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{getStatusLabel()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{routeSheet.totalKilometrage}</Text>
          <Text style={styles.statLabel}>km total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {routeSheet.days.filter((d) => d.isCompleted).length}
          </Text>
          <Text style={styles.statLabel}>jours saisis</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{routeSheet.days.length}</Text>
          <Text style={styles.statLabel}>jours total</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Progression de saisie</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${routeSheet.completionPercentage}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {routeSheet.completionPercentage}% complété
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={onView}
          activeOpacity={0.7}
        >
          <FontAwesome name="eye" size={14} color={colors.primary} />
          <Text style={[styles.buttonText, styles.viewButtonText]}>
            Consulter
          </Text>
        </TouchableOpacity>

        <ConditionalComponent isValid={canEdit}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={onEdit}
            activeOpacity={0.7}
          >
            <FontAwesome name="edit" size={14} color={colors.success} />
            <Text style={[styles.buttonText, styles.editButtonText]}>
              Modifier
            </Text>
          </TouchableOpacity>
        </ConditionalComponent>

        <ConditionalComponent isValid={!canEdit}>
          <View style={[styles.actionButton, styles.disabledButton]}>
            <FontAwesome name="lock" size={14} color={colors.textTertiary} />
            <Text style={[styles.buttonText, styles.disabledButtonText]}>
              Verrouillé
            </Text>
          </View>
        </ConditionalComponent>
      </View>
    </TouchableOpacity>
  );
};
