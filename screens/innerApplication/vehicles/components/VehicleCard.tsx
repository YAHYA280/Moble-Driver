import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Image,
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

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 12,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
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
          elevation: 3,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 2px 8px rgba(0, 0, 0, 0.3)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
        },
      }),
    },
    leftSection: {
      marginRight: 16,
    },
    vehicleImageContainer: {
      width: 60,
      height: 60,
      borderRadius: 8,
      backgroundColor: colors.backgroundSecondary,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    vehicleImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
    },
    vehicleIcon: {
      fontSize: 30,
      color: colors.primary,
    },
    statusBadge: {
      position: "absolute",
      top: -4,
      right: -4,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: statusConfig.backgroundColor,
      borderWidth: 2,
      borderColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
    },
    contentContainer: {
      flex: 1,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    plateNumber: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    brandModel: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginBottom: 8,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    infoIcon: {
      width: 16,
      textAlign: "center",
      marginRight: 8,
    },
    infoText: {
      fontSize: 12,
      color: colors.textTertiary,
      flex: 1,
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: statusConfig.backgroundColor,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 11,
      fontWeight: "600",
      color: statusConfig.color,
      marginLeft: 4,
    },
    rightSection: {
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 8,
    },
    chevronIcon: {
      padding: 4,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left Section - Vehicle Image/Icon */}
      <View style={styles.leftSection}>
        <View style={styles.vehicleImageContainer}>
          {vehicle.imageUrl ? (
            <Image
              source={{ uri: vehicle.imageUrl }}
              style={styles.vehicleImage}
            />
          ) : (
            <FontAwesome
              name={getVehicleIcon()}
              size={24}
              color={colors.primary}
            />
          )}
          <View style={styles.statusBadge}>
            <FontAwesome
              name={statusConfig.icon}
              size={8}
              color={statusConfig.color}
            />
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.plateNumber}>{vehicle.plateNumber}</Text>
          <View style={styles.statusContainer}>
            <FontAwesome
              name={statusConfig.icon}
              size={10}
              color={statusConfig.color}
            />
            <Text style={styles.statusText}>{vehicle.status}</Text>
          </View>
        </View>

        <Text style={styles.brandModel}>
          {vehicle.brand} {vehicle.model}
        </Text>

        <View style={styles.infoRow}>
          <FontAwesome
            name="calendar"
            size={10}
            color={colors.textTertiary}
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>
            Prochain entretien: {vehicle.nextMaintenanceDate}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <FontAwesome
            name="road"
            size={10}
            color={colors.textTertiary}
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>
            {vehicle.mileage.toLocaleString()} km
          </Text>
        </View>
      </View>

      {/* Right Arrow */}
      <View style={styles.rightSection}>
        <FontAwesome
          name="chevron-right"
          size={14}
          color={colors.textTertiary}
          style={styles.chevronIcon}
        />
      </View>
    </TouchableOpacity>
  );
};
