// screens/innerApplication/vehicles/components/VehicleInfoCard.tsx
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

interface VehicleInfoCardProps {
  vehicle: Vehicle;
  onPress?: () => void;
  style?: ViewStyle;
}

const VehicleInfoCard: React.FC<VehicleInfoCardProps> = ({
  vehicle,
  onPress,
  style,
}) => {
  const colors = useThemeColors();

  const Container = onPress ? TouchableOpacity : View;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 20,
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
    vehicleCard: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    vehicleImageContainer: {
      width: 80,
      height: 80,
      borderRadius: 12,
      backgroundColor: colors.backgroundTertiary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
      overflow: "hidden",
    },
    vehicleImage: {
      width: 80,
      height: 80,
      borderRadius: 12,
    },
    vehicleInfo: {
      flex: 1,
    },
    brandName: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    modelName: {
      fontSize: 16,
      fontWeight: "400",
      color: colors.textSecondary,
      marginBottom: 16,
    },
    plateRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    plateIcon: {
      marginRight: 8,
    },
    plateNumber: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginRight: 12,
    },
    licenseBadge: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    licenseBadgeIcon: {
      marginRight: 6,
    },
    licenseBadgeText: {
      color: "white",
      fontSize: 14,
      fontWeight: "600",
    },
  });

  return (
    <Container
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.vehicleCard}>
        <View style={styles.vehicleImageContainer}>
          {vehicle.imageUrl ? (
            <Image
              source={{ uri: vehicle.imageUrl }}
              style={styles.vehicleImage}
            />
          ) : (
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1580414165966-0f3c4c2d8e8e?w=80&h=80&fit=crop&crop=center",
              }}
              style={styles.vehicleImage}
            />
          )}
        </View>
        <View style={styles.vehicleInfo}>
          <Text style={styles.brandName}>{vehicle.brand}</Text>
          <Text style={styles.modelName}>{vehicle.model}</Text>
          <View style={styles.plateRow}>
            <FontAwesome
              name="credit-card"
              size={16}
              color={colors.text}
              style={styles.plateIcon}
            />
            <Text style={styles.plateNumber}>{vehicle.plateNumber}</Text>
            <View style={styles.licenseBadge}>
              <FontAwesome
                name="car"
                size={12}
                color="white"
                style={styles.licenseBadgeIcon}
              />
              <Text style={styles.licenseBadgeText}>23-XYZ-45</Text>
            </View>
          </View>
        </View>
      </View>
    </Container>
  );
};

export { VehicleInfoCard };
