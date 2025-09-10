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
import { FuelCard } from "../../../../shared/types/fuelCard";

interface FuelCardItemProps {
  fuelCard: FuelCard;
  onPress: () => void;
  style?: ViewStyle;
}

export const FuelCardItem: React.FC<FuelCardItemProps> = ({
  fuelCard,
  onPress,
  style,
}) => {
  const colors = useThemeColors();

  const getStatusConfig = () => {
    switch (fuelCard.status) {
      case "Active":
        return {
          color: colors.success,
          backgroundColor: colors.success + "15",
          icon: "check-circle" as const,
        };
      case "Inactive":
        return {
          color: colors.warning,
          backgroundColor: colors.warning + "15",
          icon: "pause-circle" as const,
        };
      case "Expired":
        return {
          color: colors.error,
          backgroundColor: colors.error + "15",
          icon: "times-circle" as const,
        };
    }
  };

  const statusConfig = getStatusConfig();
  const progressPercentage = (fuelCard.aConsomme / fuelCard.plafond) * 100;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 14,
      marginHorizontal: 16,
      marginVertical: 6,
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
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    cardInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    cardIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
    },
    cardNumber: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 14,
      backgroundColor: statusConfig.backgroundColor,
    },
    statusIcon: {
      marginRight: 5,
    },
    statusText: {
      fontSize: 11,
      fontWeight: "600",
      color: statusConfig.color,
    },
    amountsContainer: {
      marginBottom: 12,
    },
    amountRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    amountLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    amountValue: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.text,
    },
    plafondValue: {
      color: colors.primary,
    },
    consommeValue: {
      color: colors.warning,
    },
    progressContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    progressBackground: {
      height: 6,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 3,
      overflow: "hidden",
      flex: 1,
      marginRight: 8,
    },
    progressBar: {
      height: "100%",
      backgroundColor: colors.warning,
      borderRadius: 3,
    },
    progressText: {
      fontSize: 11,
      color: colors.textTertiary,
      fontWeight: "500",
      minWidth: 60,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      marginTop: 4,
    },
    chevronIcon: {
      opacity: 0.6,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.cardInfo}>
          <View style={styles.cardIcon}>
            <FontAwesome name="credit-card" size={16} color={colors.primary} />
          </View>
          <Text style={styles.cardNumber}>{fuelCard.cardNumber}</Text>
        </View>
        <View style={styles.statusBadge}>
          <FontAwesome
            name={statusConfig.icon}
            size={10}
            color={statusConfig.color}
            style={styles.statusIcon}
          />
          <Text style={styles.statusText}>{fuelCard.status}</Text>
        </View>
      </View>

      {/* Essential Amounts Only */}
      <View style={styles.amountsContainer}>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Plafond</Text>
          <Text style={[styles.amountValue, styles.plafondValue]}>
            {fuelCard.plafond.toLocaleString()} DA
          </Text>
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>À consommé</Text>
          <Text style={[styles.amountValue, styles.consommeValue]}>
            {fuelCard.aConsomme.toLocaleString()} DA
          </Text>
        </View>
      </View>

      {/* Progress Bar - Same Line */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressBar,
              { width: `${Math.min(progressPercentage, 100)}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {progressPercentage.toFixed(1)}% utilisé
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <FontAwesome
          name="chevron-right"
          size={14}
          color={colors.textSecondary}
          style={styles.chevronIcon}
        />
      </View>
    </TouchableOpacity>
  );
};
