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
      marginVertical: 6,
      borderWidth: 1,
      borderColor: colors.primary + "30",
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.2 : 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 4px rgba(116, 108, 212, 0.2)"
            : "0 2px 4px rgba(116, 108, 212, 0.1)",
        },
      }),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    documentIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    headerContent: {
      flex: 1,
    },
    idText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 2,
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      backgroundColor: statusConfig.backgroundColor,
    },
    statusIcon: {
      marginRight: 4,
    },
    statusLabel: {
      fontSize: 11,
      fontWeight: "600",
      color: statusConfig.color,
    },
    content: {
      paddingLeft: 52, // Align with header content
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    label: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    value: {
      fontSize: 13,
      color: colors.text,
      fontWeight: "600",
    },
    amountValue: {
      fontSize: 15,
      color: colors.primary,
      fontWeight: "700",
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border + "30",
    },
    dateContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    dateIcon: {
      marginRight: 4,
    },
    dateText: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: "500",
    },
    archiveLabel: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: "500",
      fontStyle: "italic",
    },
  });

  return (
    <View style={[styles.container, style]}>
      {/* Header with Document Icon */}
      <View style={styles.header}>
        <View style={styles.documentIcon}>
          <FontAwesome name="file-text-o" size={18} color={colors.primary} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.idText}>{id}</Text>
          <View style={styles.statusContainer}>
            <FontAwesome
              name={statusConfig.icon}
              size={10}
              color={statusConfig.color}
              style={styles.statusIcon}
            />
            <Text style={styles.statusLabel}>{statusConfig.label}</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Période</Text>
          <Text style={styles.value}>{monthYear}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Montant net</Text>
          <Text style={styles.amountValue}>{formatAmount(netAmount)}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <FontAwesome
            name="calendar-o"
            size={11}
            color={colors.textTertiary}
            style={styles.dateIcon}
          />
          <Text style={styles.dateText}>{availableDate}</Text>
        </View>
        <Text style={styles.archiveLabel}>Bulletin archivé</Text>
      </View>
    </View>
  );
};
