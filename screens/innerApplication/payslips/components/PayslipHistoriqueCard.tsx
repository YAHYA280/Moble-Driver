import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";

type IconType = keyof typeof FontAwesome.glyphMap;
type PayslipStatus = "available" | "pending" | "processing";

interface PayslipHistoriqueCardProps {
  id: string;
  monthYear: string;
  netAmount: number;
  status: PayslipStatus;
  availableDate: string;
  style?: ViewStyle;
}

export const PayslipHistoriqueCard: React.FC<PayslipHistoriqueCardProps> = ({
  id,
  monthYear,
  netAmount,
  status,
  availableDate,
  style,
}) => {
  const colors = useThemeColors();

  const getStatusConfig = (status: PayslipStatus) => {
    switch (status) {
      case "available":
        return {
          label: "Vu",
          color: colors.success,
          backgroundColor: colors.success + "15",
          icon: "check" as IconType,
        };
      case "pending":
        return {
          label: "Non vu",
          color: colors.warning,
          backgroundColor: colors.warning + "15",
          icon: "eye-slash" as IconType,
        };
      case "processing":
        return {
          label: "En cours",
          color: colors.info,
          backgroundColor: colors.info + "15",
          icon: "clock-o" as IconType,
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      marginHorizontal: 16,
      marginVertical: 4,
      borderRadius: 12,
      backgroundColor: colors.card,
      minHeight: 80,
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
        web: {
          boxShadow: colors.isDark
            ? "0 2px 4px rgba(0, 0, 0, 0.3)"
            : "0 2px 4px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
      backgroundColor: "#6366f1",
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
    statusLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: statusConfig.color,
    },
    rightSection: {
      alignItems: "flex-end",
      justifyContent: "center",
    },
    dateText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "400",
      marginBottom: 4,
    },
    periodText: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: "400",
      marginBottom: 2,
    },
    amountText: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: "500",
    },
  });

  return (
    <View style={[styles.container, style]}>
      {/* Left Icon */}
      <View style={styles.iconContainer}>
        <FontAwesome name="credit-card" size={18} color="white" />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.payslipId} numberOfLines={1}>
          {id}
        </Text>
        <Text style={styles.statusLabel}>{statusConfig.label}</Text>
      </View>

      {/* Right Section */}
      <View style={styles.rightSection}>
        <Text style={styles.dateText}>
          {availableDate.split("/")[1]}/{availableDate.split("/")[2]}
        </Text>
      </View>
    </View>
  );
};
