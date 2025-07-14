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
      borderRadius: 16,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: colors.isDark ? 0.3 : 0.12,
          shadowRadius: 16,
        },
        android: {
          elevation: 8,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 16px rgba(0, 0, 0, 0.3)"
            : "0 4px 16px rgba(0, 0, 0, 0.12)",
        },
      }),
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    leftHeader: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    plateNumber: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginRight: 12,
      letterSpacing: 0.5,
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
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    licenseBadgeIcon: {
      marginRight: 8,
    },
    licenseBadgeText: {
      color: "white",
      fontSize: 14,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    brandModelRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    brandContainer: {
      flex: 1,
    },
    brandLabel: {
      fontSize: 13,
      color: colors.textTertiary,
      fontWeight: "500",
      marginBottom: 6,
      letterSpacing: 0.3,
    },
    brandValue: {
      fontSize: 18,
      color: colors.text,
      fontWeight: "700",
      letterSpacing: 0.3,
    },
    modelContainer: {
      flex: 1,
      alignItems: "flex-end",
    },
    modelLabel: {
      fontSize: 13,
      color: colors.textTertiary,
      fontWeight: "500",
      marginBottom: 6,
      letterSpacing: 0.3,
    },
    modelValue: {
      fontSize: 18,
      color: colors.text,
      fontWeight: "700",
      letterSpacing: 0.3,
    },
    divider: {
      height: 1,
      backgroundColor: "transparent",
      marginBottom: 24,
      position: "relative",
      overflow: "visible",
    },
    dashedLine: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 1,
      borderStyle: "dashed",
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    leftCurve: {
      position: "absolute",
      left: -12,
      top: -10,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: colors.isDark ? 0.2 : 0.08,
          shadowRadius: 2,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    rightCurve: {
      position: "absolute",
      right: -12,
      top: -10,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: colors.isDark ? 0.2 : 0.08,
          shadowRadius: 2,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    nextControlRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    nextControlLabel: {
      fontSize: 15,
      color: colors.textTertiary,
      fontWeight: "500",
      letterSpacing: 0.2,
    },
    nextControlDate: {
      fontSize: 18,
      color: colors.text,
      fontWeight: "700",
      letterSpacing: 0.3,
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
