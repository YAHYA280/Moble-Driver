// screens/innerApplication/fuelCards/components/FuelCardInfoCard.tsx
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";
import { FuelCard } from "../../../../shared/types/fuelCard";

interface FuelCardInfoCardProps {
  fuelCard: FuelCard;
  style?: ViewStyle;
}

export const FuelCardInfoCard: React.FC<FuelCardInfoCardProps> = ({
  fuelCard,
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
  const remainingBalance = fuelCard.plafond - fuelCard.aConsomme;
  const progressPercentage = (fuelCard.aConsomme / fuelCard.plafond) * 100;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 12,
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
      marginBottom: 20,
    },
    cardIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    headerContent: {
      flex: 1,
    },
    cardNumber: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    driverName: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: statusConfig.backgroundColor,
    },
    statusIcon: {
      marginRight: 6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
      color: statusConfig.color,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 16,
    },
    detailsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
      marginBottom: 20,
    },
    detailItem: {
      flex: 1,
      minWidth: "45%",
    },
    detailLabel: {
      fontSize: 13,
      color: colors.textTertiary,
      fontWeight: "500",
      marginBottom: 4,
    },
    detailValue: {
      fontSize: 15,
      color: colors.text,
      fontWeight: "600",
    },
    plafondValue: {
      color: colors.primary,
    },
    consommeValue: {
      color: colors.warning,
    },
    horsCarteValue: {
      color: colors.error,
    },
    remainingValue: {
      color: colors.success,
    },
    progressSection: {
      marginTop: 16,
    },
    progressLabel: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "600",
      marginBottom: 8,
    },
    progressBackground: {
      height: 12,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 6,
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      backgroundColor: colors.warning,
      borderRadius: 6,
    },
    progressText: {
      fontSize: 12,
      color: colors.textTertiary,
      textAlign: "center",
      marginTop: 6,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.cardIcon}>
          <FontAwesome name="credit-card" size={20} color={colors.primary} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.cardNumber}>{fuelCard.cardNumber}</Text>
          <Text style={styles.driverName}>{fuelCard.assignedDriverName}</Text>
        </View>
        <View style={styles.statusBadge}>
          <FontAwesome
            name={statusConfig.icon}
            size={12}
            color={statusConfig.color}
            style={styles.statusIcon}
          />
          <Text style={styles.statusText}>{fuelCard.status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Details Grid */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Plafond</Text>
          <Text style={[styles.detailValue, styles.plafondValue]}>
            {fuelCard.plafond.toLocaleString()} DA
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>À consommé</Text>
          <Text style={[styles.detailValue, styles.consommeValue]}>
            {fuelCard.aConsomme.toLocaleString()} DA
          </Text>
        </View>
        <ConditionalComponent isValid={fuelCard.horsCarteTotal > 0}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Hors carte</Text>
            <Text style={[styles.detailValue, styles.horsCarteValue]}>
              {fuelCard.horsCarteTotal.toLocaleString()} DA
            </Text>
          </View>
        </ConditionalComponent>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Reste</Text>
          <Text style={[styles.detailValue, styles.remainingValue]}>
            {remainingBalance.toLocaleString()} DA
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Date d'expiration</Text>
          <Text style={styles.detailValue}>
            {new Date(fuelCard.expiryDate).toLocaleDateString("fr-FR")}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Nombre de reçus</Text>
          <Text style={styles.detailValue}>{fuelCard.receipts.length}</Text>
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>Utilisation de la carte</Text>
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
    </View>
  );
};
