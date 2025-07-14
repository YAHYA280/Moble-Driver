// screens/innerApplication/vehicles/components/AssignedVehicleCard.tsx
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

interface AssignedVehicleCardProps {
  vehicle: Vehicle;
  onPress: () => void;
  style?: ViewStyle;
}

const AssignedVehicleCard: React.FC<AssignedVehicleCardProps> = ({
  vehicle,
  onPress,
  style,
}) => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
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
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    leftHeader: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    plateNumber: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginRight: 8,
    },
    distance: {
      fontSize: 14,
      color: colors.textTertiary,
      fontWeight: "500",
    },
    licenseBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    licenseBadgeIcon: {
      marginRight: 6,
    },
    licenseBadgeText: {
      color: "white",
      fontSize: 12,
      fontWeight: "600",
    },
    brandModelRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    brandContainer: {
      flex: 1,
    },
    brandLabel: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: "500",
      marginBottom: 4,
    },
    brandValue: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "600",
    },
    modelContainer: {
      flex: 1,
      alignItems: "flex-end",
    },
    modelLabel: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: "500",
      marginBottom: 4,
    },
    modelValue: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "600",
    },
    divider: {
      height: 1,
      backgroundColor: "transparent",
      marginBottom: 20,
      position: "relative",
      overflow: "hidden",
    },
    dashedLine: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 1,
      borderStyle: "dashed",
      borderWidth: 1,
      borderColor: colors.primary,
    },
    leftCurve: {
      position: "absolute",
      left: -8,
      top: -8,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    rightCurve: {
      position: "absolute",
      right: -8,
      top: -8,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    nextControlRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    nextControlLabel: {
      fontSize: 14,
      color: colors.textTertiary,
      fontWeight: "500",
    },
    nextControlDate: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "600",
    },
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.leftHeader}>
          <Text style={styles.plateNumber}>{vehicle.plateNumber}</Text>
          <Text style={styles.distance}>1.5 Km</Text>
        </View>
        <View style={styles.licenseBadge}>
          <FontAwesome
            name="car"
            size={12}
            color="white"
            style={styles.licenseBadgeIcon}
          />
          <Text style={styles.licenseBadgeText}>L</Text>
        </View>
      </View>

      {/* Brand and Model Row */}
      <View style={styles.brandModelRow}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandLabel}>Marque</Text>
          <Text style={styles.brandValue}>{vehicle.brand}</Text>
        </View>
        <View style={styles.modelContainer}>
          <Text style={styles.modelLabel}>Modèle</Text>
          <Text style={styles.modelValue}>{vehicle.model}</Text>
        </View>
      </View>

      {/* Dashed Divider with Curved Cuts */}
      <View style={styles.divider}>
        <View style={styles.dashedLine} />
        <View style={styles.leftCurve} />
        <View style={styles.rightCurve} />
      </View>

      {/* Next Technical Control */}
      <View style={styles.nextControlRow}>
        <Text style={styles.nextControlLabel}>Prochain controle technique</Text>
        <Text style={styles.nextControlDate}>
          {vehicle.technicalControlDate}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export { AssignedVehicleCard };
