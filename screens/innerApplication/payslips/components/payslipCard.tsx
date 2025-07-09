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

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const statusConfig = getStatusConfig(status);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
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
    monthYear: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: statusConfig.backgroundColor,
    },
    statusIcon: {
      marginRight: 4,
    },
    statusLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: statusConfig.color,
    },
    content: {
      marginBottom: 16,
    },
    amountContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    amountLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    amount: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.primary,
    },
    dateContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    dateIcon: {
      marginRight: 6,
    },
    dateLabel: {
      fontSize: 13,
      color: colors.textTertiary,
      fontWeight: "400",
    },
    actions: {
      flexDirection: "row",
      gap: 12,
    },
    actionButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      gap: 6,
    },
    primaryAction: {
      backgroundColor: colors.primary,
    },
    secondaryAction: {
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    primaryActionText: {
      color: "white",
      fontSize: 14,
      fontWeight: "600",
    },
    secondaryActionText: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: "600",
    },
    disabledAction: {
      opacity: 0.5,
    },
  });

  const isDownloadDisabled = status !== "available";

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.monthYear}>{monthYear}</Text>
        <View style={styles.statusContainer}>
          <FontAwesome
            name={statusConfig.icon}
            size={12}
            color={statusConfig.color}
            style={styles.statusIcon}
          />
          <Text style={styles.statusLabel}>{statusConfig.label}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Montant net à payer</Text>
          <Text style={styles.amount}>{formatAmount(netAmount)}</Text>
        </View>

        <View style={styles.dateContainer}>
          <FontAwesome
            name="calendar-o"
            size={12}
            color={colors.textTertiary}
            style={styles.dateIcon}
          />
          <Text style={styles.dateLabel}>Disponible le {availableDate}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryAction]}
          onPress={onViewDetails}
          activeOpacity={0.7}
        >
          <FontAwesome name="eye" size={14} color="white" />
          <Text style={styles.primaryActionText}>Voir détails</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.secondaryAction,
            isDownloadDisabled && styles.disabledAction,
          ]}
          onPress={onDownload}
          disabled={isDownloadDisabled}
          activeOpacity={0.7}
        >
          <FontAwesome
            name="download"
            size={14}
            color={isDownloadDisabled ? colors.textMuted : colors.textSecondary}
          />
          <Text
            style={[
              styles.secondaryActionText,
              {
                color: isDownloadDisabled
                  ? colors.textMuted
                  : colors.textSecondary,
              },
            ]}
          >
            Télécharger
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
