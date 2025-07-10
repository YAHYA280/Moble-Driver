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

type IconType = keyof typeof FontAwesome.glyphMap;
type PayslipStatus = "available" | "pending" | "processing";

interface PayslipCardProps {
  id: string;
  monthYear: string;
  netAmount: number;
  status: PayslipStatus;
  availableDate: string;
  onViewDetails: () => void;
  onDownload: () => void;
  style?: ViewStyle;
}

export const PayslipCard: React.FC<PayslipCardProps> = ({
  id,
  monthYear,
  netAmount,
  status,
  availableDate,
  onViewDetails,
  onDownload,
  style,
}) => {
  const colors = useThemeColors();

  const getStatusConfig = (status: PayslipStatus) => {
    switch (status) {
      case "available":
        return {
          label: "Disponible",
          color: colors.success,
          backgroundColor: colors.success + "15",
          icon: "check-circle" as IconType,
        };
      case "pending":
        return {
          label: "En attente",
          color: colors.warning,
          backgroundColor: colors.warning + "15",
          icon: "clock-o" as IconType,
        };
      case "processing":
        return {
          label: "En cours",
          color: colors.info,
          backgroundColor: colors.info + "15",
          icon: "refresh" as IconType,
        };
    }
  };

  const formatDateRange = (availableDate: string) => {
    const dateParts = availableDate.split("/");
    if (dateParts.length === 3) {
      const [day, month, year] = dateParts;
      return `${month}/${year} → ${availableDate}`;
    }
    return availableDate;
  };

  const statusConfig = getStatusConfig(status);

  const getIconBackgroundColor = () => {
    switch (status) {
      case "available":
        return "#22c55e";
      case "pending":
        return "#ef4444";
      case "processing":
        return "#f59e0b";
      default:
        return "#6366f1";
    }
  };

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
    payslipId: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    dateRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    dateText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "400",
    },
    statusLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: statusConfig.color,
    },
    rightSection: {
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 12,
    },
    downloadButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.isDark
        ? colors.surfaceSecondary
        : "rgba(0, 0, 0, 0.05)",
    },
    disabledAction: {
      opacity: 0.5,
    },
  });

  const isDownloadDisabled = status !== "available";

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onViewDetails}
      activeOpacity={0.7}
    >
      {/* Left Icon */}
      <View style={styles.iconContainer}>
        <FontAwesome name="credit-card" size={20} color="white" />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.payslipId} numberOfLines={1}>
          {id}
        </Text>

        <View style={styles.dateRow}>
          <Text style={styles.dateText}>{formatDateRange(availableDate)}</Text>
        </View>

        <Text style={styles.statusLabel}>{statusConfig.label}</Text>
      </View>

      {/* Right Download Button */}
      <View style={styles.rightSection}>
        <TouchableOpacity
          style={[
            styles.downloadButton,
            isDownloadDisabled && styles.disabledAction,
          ]}
          onPress={onDownload}
          disabled={isDownloadDisabled}
          activeOpacity={0.7}
        >
          <FontAwesome
            name="download"
            size={18}
            color={isDownloadDisabled ? colors.textMuted : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
