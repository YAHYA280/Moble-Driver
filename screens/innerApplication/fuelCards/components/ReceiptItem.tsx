// screens/innerApplication/fuelCards/components/ReceiptItem.tsx
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
import ConditionalComponent from "../../../../shared/components/conditionalComponent/conditionalComponent";
import { Receipt } from "../../../../shared/types/fuelCard";

interface ReceiptItemProps {
  receipt: Receipt;
  onPress: () => void;
  style?: ViewStyle;
}

export const ReceiptItem: React.FC<ReceiptItemProps> = ({
  receipt,
  onPress,
  style,
}) => {
  const colors = useThemeColors();

  const getPaymentMethodConfig = () => {
    switch (receipt.paymentMethod) {
      case "Carte carburant":
        return {
          color: colors.primary,
          backgroundColor: colors.primary + "15",
          icon: "credit-card" as const,
        };
      case "Hors carte":
        return {
          color: colors.error,
          backgroundColor: colors.error + "15",
          icon: "money" as const,
        };
    }
  };

  const paymentConfig = getPaymentMethodConfig();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: 16,
      borderLeftWidth: 4,
      borderLeftColor: paymentConfig.color,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: colors.isDark ? 0.2 : 0.05,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 1px 4px rgba(0, 0, 0, 0.2)"
            : "0 1px 4px rgba(0, 0, 0, 0.05)",
        },
      }),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    leftSection: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: paymentConfig.backgroundColor,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    mainInfo: {
      flex: 1,
    },
    amount: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 2,
    },
    stationName: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    rightSection: {
      alignItems: "flex-end",
    },
    dateTime: {
      fontSize: 12,
      color: colors.textTertiary,
      marginBottom: 4,
    },
    paymentBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: paymentConfig.backgroundColor,
    },
    paymentText: {
      fontSize: 11,
      fontWeight: "600",
      color: paymentConfig.color,
    },
    bottomSection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    vehicleInfo: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: "500",
    },
    hasPhoto: {
      flexDirection: "row",
      alignItems: "center",
    },
    photoIcon: {
      marginRight: 4,
    },
    photoText: {
      fontSize: 11,
      color: colors.success,
      fontWeight: "500",
    },
    notes: {
      fontSize: 12,
      color: colors.textSecondary,
      fontStyle: "italic",
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
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
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <FontAwesome
              name={paymentConfig.icon}
              size={14}
              color={paymentConfig.color}
            />
          </View>
          <View style={styles.mainInfo}>
            <Text style={styles.amount}>
              {receipt.amount.toLocaleString()} DA
            </Text>
            <ConditionalComponent isValid={!!receipt.stationName}>
              <Text style={styles.stationName}>{receipt.stationName}</Text>
            </ConditionalComponent>
          </View>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.dateTime}>
            {receipt.date} {receipt.time}
          </Text>
          <View style={styles.paymentBadge}>
            <Text style={styles.paymentText}>{receipt.paymentMethod}</Text>
          </View>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <ConditionalComponent isValid={!!receipt.vehiclePlateNumber}>
          <Text style={styles.vehicleInfo}>
            Véhicule: {receipt.vehiclePlateNumber}
          </Text>
        </ConditionalComponent>
        <ConditionalComponent isValid={!!receipt.photoUri}>
          <View style={styles.hasPhoto}>
            <FontAwesome
              name="camera"
              size={12}
              color={colors.success}
              style={styles.photoIcon}
            />
            <Text style={styles.photoText}>Photo jointe</Text>
          </View>
        </ConditionalComponent>
      </View>

      {/* Notes */}
      <ConditionalComponent isValid={!!receipt.notes}>
        <Text style={styles.notes}>{receipt.notes}</Text>
      </ConditionalComponent>
    </TouchableOpacity>
  );
};
