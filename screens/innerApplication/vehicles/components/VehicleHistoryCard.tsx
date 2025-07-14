// screens/innerApplication/vehicles/components/VehicleHistoryCard.tsx
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
import { Vehicle } from "../../../../shared/types/vehicle";

interface VehicleHistoryCardProps {
  vehicle: Vehicle;
  onPress: () => void;
  style?: ViewStyle;
}

const VehicleHistoryCard: React.FC<VehicleHistoryCardProps> = ({
  vehicle,
  onPress,
  style,
}) => {
  const colors = useThemeColors();

  const getStatusConfig = () => {
    switch (vehicle.status) {
      case "En service":
        return {
          label: "En service",
          color: colors.success,
          backgroundColor: colors.success + "15",
          icon: "check" as const,
        };
      case "En maintenance":
        return {
          label: "En maintenance",
          color: colors.warning,
          backgroundColor: colors.warning + "15",
          icon: "wrench" as const,
        };
      case "Hors service":
        return {
          label: "Hors service",
          color: colors.error,
          backgroundColor: colors.error + "15",
          icon: "times" as const,
        };
    }
  };

  const statusConfig = getStatusConfig();

  const getIconBackgroundColor = () => {
    switch (vehicle.status) {
      case "En service":
        return "#22c55e";
      case "En maintenance":
        return "#f59e0b";
      case "Hors service":
        return "#ef4444";
      default:
        return "#6366f1";
    }
  };

  const formatVehicleId = () => {
    return `957H15/${vehicle.brand}-CV56`;
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
    vehicleId: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    distanceRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    distanceText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "500",
      marginBottom: 4,
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
    dateText: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: "400",
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
        <FontAwesome name="car" size={20} color="white" />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.vehicleId} numberOfLines={1}>
          {formatVehicleId()}
        </Text>

        <Text style={styles.statusLabel}>{statusConfig.label}</Text>
      </View>

      {/* Right Section */}
      <View style={styles.rightSection}>
        <Text style={styles.distanceText}>20 Km</Text>
        <Text style={styles.dateText}>{vehicle.lastMaintenanceDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

export { VehicleHistoryCard };
