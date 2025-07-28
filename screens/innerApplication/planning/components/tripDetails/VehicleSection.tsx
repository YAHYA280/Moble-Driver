// screens/innerApplication/planning/components/tripDetails/VehicleSection.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../../../../contexts/ThemeContext";
import { Trip } from "../../../../../shared/types/planning";
import { useVehicleStore } from "../../../../../store/vehicleStore";

interface VehicleSectionProps {
  trip: Trip;
}

const styles = StyleSheet.create({
  vehicleSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  vehicleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  vehicleCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleImageContainer: {
    width: 100,
    height: 80,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    marginRight: 20,
    overflow: "hidden",
  },
  vehicleImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  vehicleModel: {
    fontSize: 16,
    opacity: 0.6,
    marginBottom: 12,
  },
  vehiclePlateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  plateIcon: {
    marginRight: 8,
  },
  plateNumber: {
    fontSize: 16,
    fontWeight: "700",
    marginRight: 12,
  },
  plateBadge: {
    backgroundColor: "#746cd4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  plateBadgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  vehicleChevron: {
    marginLeft: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  routeIcon: {
    marginRight: 8,
  },
});

export const VehicleSection: React.FC<VehicleSectionProps> = ({ trip }) => {
  const { colors } = useTheme();

  const handleVehiclePress = () => {
    if (trip?.assignedVehicle) {
      const { vehicles, selectVehicle } = useVehicleStore.getState();

      const vehicle = vehicles.find(
        (v) =>
          v.id === trip.assignedVehicle?.id ||
          v.plateNumber === trip.assignedVehicle?.plateNumber
      );

      if (vehicle) {
        selectVehicle(vehicle);
        router.push(
          `/(tabs)/vehicles/details?returnTo=planning&tripId=${trip.id}`
        );
      } else {
        console.log("Vehicle not found in store");
      }
    }
  };

  const dynamicStyles = {
    vehicleSection: {
      ...styles.vehicleSection,
      backgroundColor: colors.card,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: { elevation: 3 },
      }),
    },
    vehicleTitle: {
      ...styles.vehicleTitle,
      color: colors.text,
    },
    vehicleName: {
      ...styles.vehicleName,
      color: colors.text,
    },
    vehicleModel: {
      ...styles.vehicleModel,
      color: colors.textSecondary,
    },
    plateNumber: {
      ...styles.plateNumber,
      color: colors.text,
    },
  };

  return (
    <View style={dynamicStyles.vehicleSection}>
      <View style={styles.vehicleHeader}>
        <FontAwesome
          name="car"
          size={18}
          color={colors.error}
          style={styles.routeIcon}
        />
        <Text style={dynamicStyles.vehicleTitle}>Véhicule Assigné</Text>
      </View>

      <TouchableOpacity
        style={styles.vehicleCard}
        onPress={handleVehiclePress}
        activeOpacity={0.7}
      >
        <View style={styles.vehicleImageContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=300&h=200&fit=crop&crop=center",
            }}
            style={styles.vehicleImage}
          />
        </View>

        <View style={styles.vehicleInfo}>
          <Text style={dynamicStyles.vehicleName}>
            {trip.assignedVehicle?.brand || "Mercedes-Benz"}
          </Text>
          <Text style={dynamicStyles.vehicleModel}>
            {trip.assignedVehicle?.model || "S 580 e 4MATIC Long"}
          </Text>

          <View style={styles.vehiclePlateContainer}>
            <FontAwesome
              name="credit-card"
              size={16}
              color={colors.textSecondary}
              style={styles.plateIcon}
            />
            <Text style={dynamicStyles.plateNumber}>
              {trip.assignedVehicle?.plateNumber || "SN-UX420-77V1"}
            </Text>
            <View style={styles.plateBadge}>
              <Text style={styles.plateBadgeText}>23-XYZ-45</Text>
            </View>
          </View>
        </View>

        <View style={styles.vehicleChevron}>
          <FontAwesome
            name="chevron-right"
            size={16}
            color={colors.textSecondary}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};
