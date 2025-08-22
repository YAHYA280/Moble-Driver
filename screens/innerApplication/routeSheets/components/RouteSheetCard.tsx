import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
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

  const isCurrentMonth = () => {
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;
    return routeSheet.month === currentMonth;
  };

  const handleDownload = () => {
    Alert.alert(
      "Téléchargement",
      "Cette fonctionnalité sera bientôt implémentée.",
      [{ text: "OK" }]
    );
  };

  const canEdit = isCurrentMonth();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: 24,
      marginHorizontal: 16,
      marginVertical: 10,
      borderRadius: 18,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border + "20",
      minHeight: 100,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: colors.isDark ? 0.3 : 0.12,
          shadowRadius: 12,
        },
        android: {
          elevation: 6,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 12px rgba(0, 0, 0, 0.3)"
            : "0 4px 12px rgba(0, 0, 0, 0.12)",
        },
      }),
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 20,
      backgroundColor: colors.primary,
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
      paddingRight: 16,
    },
    monthName: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
      letterSpacing: -0.3,
    },
    kilometersText: {
      fontSize: 15,
      color: colors.textSecondary,
      fontWeight: "500",
      marginBottom: 12,
    },
    progressContainer: {
      marginBottom: 12,
    },
    progressBar: {
      width: "100%",
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.backgroundTertiary,
      overflow: "hidden",
      marginBottom: 6,
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    progressText: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: "600",
    },
    lastModifiedText: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: "400",
    },
    rightSection: {
      alignItems: "center",
      justifyContent: "center",
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.isDark
        ? colors.surfaceSecondary
        : "rgba(0, 0, 0, 0.06)",
    },
    downloadButton: {
      backgroundColor: colors.primary + "15",
    },
    editButton: {
      backgroundColor: colors.success + "15",
    },
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left Icon */}
      <View style={styles.iconContainer}>
        <FontAwesome name="file-text-o" size={28} color="white" />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Title */}
        <Text style={styles.monthName} numberOfLines={1}>
          {routeSheet.monthName}
        </Text>

        {/* Kilometers */}
        <Text style={styles.kilometersText}>
          <FontAwesome name="road" size={14} color={colors.textSecondary} />{" "}
          {routeSheet.totalKilometrage} km parcourus
        </Text>

        {/* Progress Bar - Full Width */}
        <View style={styles.progressContainer}>
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

        {/* Last Modified Date */}
        <Text style={styles.lastModifiedText}>
          <FontAwesome name="clock-o" size={12} color={colors.textTertiary} />{" "}
          Modifié le{" "}
          {new Date(routeSheet.lastModified).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Text>
      </View>

      {/* Right Action Button */}
      <View style={styles.rightSection}>
        {/* Download Button - Only for previous months */}
        <ConditionalComponent isValid={!canEdit}>
          <TouchableOpacity
            style={[styles.actionButton, styles.downloadButton]}
            onPress={handleDownload}
            activeOpacity={0.7}
          >
            <FontAwesome name="download" size={16} color={colors.primary} />
          </TouchableOpacity>
        </ConditionalComponent>

        {/* Edit Button - Only for current month */}
        <ConditionalComponent isValid={canEdit && !!onEdit}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={onEdit}
            activeOpacity={0.7}
          >
            <FontAwesome name="edit" size={16} color={colors.success} />
          </TouchableOpacity>
        </ConditionalComponent>
      </View>
    </TouchableOpacity>
  );
};
