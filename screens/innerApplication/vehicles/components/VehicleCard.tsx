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

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress: () => void;
  style?: ViewStyle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onPress,
  style,
}) => {
  const colors = useThemeColors();

  const getStatusConfig = () => {
    switch (vehicle.status) {
      case "En service":
        return {
          color: colors.success,
          backgroundColor: colors.success + "15",
          icon: "check-circle" as const,
        };
      case "En maintenance":
        return {
          color: colors.warning,
          backgroundColor: colors.warning + "15",
          icon: "wrench" as const,
        };
      case "Hors service":
        return {
          color: colors.error,
          backgroundColor: colors.error + "15",
          icon: "times-circle" as const,
        };
    }
  };

  const statusConfig = getStatusConfig();

  const getVehicleIcon = () => {
    // Return different icons based on vehicle type/capacity
    if (vehicle.capacity > 7) return "bus";
    if (vehicle.capacity > 5) return "car"; // SUV/Van style
    return "car"; // Regular car
  };

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
    plateNumber: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    brandModelRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    brandModel: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "400",
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 2,
    },
    infoText: {
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
    statusButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.isDark
        ? colors.surfaceSecondary
        : "rgba(0, 0, 0, 0.05)",
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
        <FontAwesome name={getVehicleIcon()} size={20} color="white" />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.plateNumber} numberOfLines={1}>
          {vehicle.plateNumber}
        </Text>

        <View style={styles.brandModelRow}>
          <Text style={styles.brandModel}>
            {vehicle.brand} {vehicle.model}
          </Text>
        </View>

        <Text style={styles.statusLabel}>{vehicle.status}</Text>
      </View>

      {/* Right Section */}
      <View style={styles.rightSection}>
        <TouchableOpacity
          style={styles.statusButton}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <FontAwesome
            name="chevron-right"
            size={18}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
