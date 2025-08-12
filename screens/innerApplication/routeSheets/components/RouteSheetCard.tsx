import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { RouteSheet } from "../../../../shared/types/routeSheet";

interface RouteSheetCardProps {
  routeSheet: RouteSheet;
  onPress: () => void;
  onEdit?: () => void;
  style?: ViewStyle;
}

export const RouteSheetCard: React.FC<RouteSheetCardProps> = ({
  routeSheet,
  onPress,
  onEdit,
  style,
}) => {
  const colors = useThemeColors();

  const getStatusConfig = () => {
    switch (routeSheet.status) {
      case "draft":
        return {
          label: "Brouillon",
          color: colors.warning,
          backgroundColor: colors.warning + "15",
          icon: "edit" as const,
        };
      case "submitted":
        return {
          label: "Soumise",
          color: colors.success,
          backgroundColor: colors.success + "15",
          icon: "check-circle" as const,
        };
      case "archived":
        return {
          label: "Archivée",
          color: colors.textTertiary,
          backgroundColor: colors.textTertiary + "15",
          icon: "archive" as const,
        };
    }
  };

  const getIconBackgroundColor = () => {
    switch (routeSheet.status) {
      case "draft":
        return "#f59e0b";
      case "submitted":
        return "#22c55e";
      case "archived":
        return "#6b7280";
      default:
        return "#6366f1";
    }
  };

  const statusConfig = getStatusConfig();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 6,
      borderRadius: 12,
      backgroundColor: colors.card,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 2,
          },
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
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
      backgroundColor: getIconBackgroundColor(),
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
    },
    monthName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    infoText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "400",
      marginRight: 12,
    },
    statusLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: statusConfig.color,
    },
    rightSection: {
      alignItems: "flex-end",
      justifyContent: "center",
      marginLeft: 12,
    },
    progressContainer: {
      alignItems: "flex-end",
      marginBottom: 8,
    },
    progressText: {
      fontSize: 12,
      color: colors.textTertiary,
      marginBottom: 4,
    },
    progressBar: {
      width: 60,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.backgroundTertiary,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
    kilometrageText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    editButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.isDark
        ? colors.surfaceSecondary
        : "rgba(0, 0, 0, 0.05)",
      marginTop: 8,
    },
  });

  const canEdit = routeSheet.status === "draft";

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left Icon */}
      <View style={styles.iconContainer}>
        <FontAwesome name="file-text" size={20} color="white" />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.monthName} numberOfLines={1}>
          {routeSheet.monthName}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>{routeSheet.totalKilometrage} km</Text>
          <Text style={styles.statusLabel}>{statusConfig.label}</Text>
        </View>

        <Text style={styles.infoText}>
          Modifié le{" "}
          {new Date(routeSheet.lastModified).toLocaleDateString("fr-FR")}
        </Text>
      </View>

      {/* Right Section */}
      <View style={styles.rightSection}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {routeSheet.completionPercentage}%
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${routeSheet.completionPercentage}%` },
              ]}
            />
          </View>
        </View>

        {canEdit && onEdit && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={onEdit}
            activeOpacity={0.7}
          >
            <FontAwesome name="edit" size={14} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};
