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
          color: colors.success,
          backgroundColor: colors.success + "20",
          icon: "check" as const,
        };
      case "En maintenance":
        return {
          color: colors.error,
          backgroundColor: colors.error + "20",
          icon: "times" as const,
        };
      case "Hors service":
        return {
          color: colors.error,
          backgroundColor: colors.error + "20",
          icon: "times" as const,
        };
    }
  };

  const statusConfig = getStatusConfig();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 4,
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
    statusIcon: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: statusConfig.backgroundColor,
      position: "relative",
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
    },
    vehicleId: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    statusText: {
      fontSize: 14,
      fontWeight: "600",
      color: statusConfig.color,
    },
    rightSection: {
      alignItems: "flex-end",
      justifyContent: "center",
      minWidth: 60,
    },
    distanceText: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: "500",
      marginBottom: 4,
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
      {/* Left Status Icon */}
      <View style={styles.leftSection}>
        <View style={styles.statusIcon}>
          <FontAwesome
            name="shopping-bag"
            size={18}
            color={statusConfig.color}
          />
          <View
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: statusConfig.color,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesome name={statusConfig.icon} size={8} color="white" />
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.vehicleId}>957H15/{vehicle.brand}-CV56</Text>
        <Text style={styles.statusText}>{vehicle.status}</Text>
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
