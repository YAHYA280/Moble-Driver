import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { MaintenanceRecord } from "../../../shared/types/vehicle";
import { useVehicleStore } from "../../../store/vehicleStore";

export const VehicleDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { selectedVehicle } = useVehicleStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!selectedVehicle) {
      router.back();
      return;
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [selectedVehicle]);

  if (!selectedVehicle) {
    return null;
  }

  const getStatusConfig = () => {
    switch (selectedVehicle.status) {
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
    if (selectedVehicle.capacity > 7) return "bus";
    if (selectedVehicle.capacity > 5) return "car";
    return "car";
  };

  const renderInfoRow = (
    icon: string,
    label: string,
    value: string,
    isHighlighted = false
  ) => (
    <View style={styles.infoRow}>
      <View style={styles.infoIconContainer}>
        <FontAwesome name={icon as any} size={16} color={colors.textTertiary} />
      </View>
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text
        style={[
          styles.infoValue,
          {
            color: isHighlighted ? colors.primary : colors.text,
            fontWeight: isHighlighted ? "700" : "600",
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );

  const renderMaintenanceItem = (
    maintenance: MaintenanceRecord,
    index: number
  ) => (
    <View key={maintenance.id} style={styles.maintenanceItem}>
      <View style={styles.maintenanceIconContainer}>
        <FontAwesome name="wrench" size={14} color={colors.primary} />
      </View>
      <View style={styles.maintenanceContent}>
        <Text style={[styles.maintenanceType, { color: colors.text }]}>
          {maintenance.type}
        </Text>
        <Text style={[styles.maintenanceDate, { color: colors.textSecondary }]}>
          {maintenance.date}
        </Text>
        {maintenance.description && (
          <Text
            style={[
              styles.maintenanceDescription,
              { color: colors.textTertiary },
            ]}
          >
            {maintenance.description}
          </Text>
        )}
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 100,
    },
    vehicleImageSection: {
      alignItems: "center",
      marginBottom: 24,
    },
    vehicleImageContainer: {
      width: 120,
      height: 120,
      borderRadius: 16,
      backgroundColor: colors.backgroundTertiary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
      borderWidth: 2,
      borderColor: colors.border,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.3 : 0.1,
          shadowRadius: 12,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    vehicleImage: {
      width: 120,
      height: 120,
      borderRadius: 16,
    },
    vehicleIcon: {
      fontSize: 60,
      color: colors.primary,
    },
    vehicleTitleContainer: {
      alignItems: "center",
    },
    plateNumber: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
    },
    brandModel: {
      fontSize: 18,
      fontWeight: "500",
      color: colors.textSecondary,
      marginBottom: 12,
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: statusConfig.backgroundColor,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    statusText: {
      fontSize: 14,
      fontWeight: "600",
      color: statusConfig.color,
      marginLeft: 8,
    },
    section: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "30",
    },
    infoIconContainer: {
      width: 32,
      alignItems: "center",
      marginRight: 12,
    },
    infoLabel: {
      fontSize: 14,
      fontWeight: "500",
      flex: 1,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: "600",
      textAlign: "right",
    },
    maintenanceItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "20",
    },
    maintenanceIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
      marginTop: 2,
    },
    maintenanceContent: {
      flex: 1,
    },
    maintenanceType: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 4,
    },
    maintenanceDate: {
      fontSize: 12,
      fontWeight: "500",
      marginBottom: 4,
    },
    maintenanceDescription: {
      fontSize: 12,
      fontWeight: "400",
      lineHeight: 16,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 24,
      textAlign: "center",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Détails du véhicule"
      />

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.subtitle}>
            Informations détaillées de votre véhicule
          </Text>

          {/* Vehicle Image & Basic Info */}
          <View style={styles.vehicleImageSection}>
            <View style={styles.vehicleImageContainer}>
              {selectedVehicle.imageUrl ? (
                <Image
                  source={{ uri: selectedVehicle.imageUrl }}
                  style={styles.vehicleImage}
                />
              ) : (
                <FontAwesome
                  name={getVehicleIcon()}
                  size={60}
                  color={colors.primary}
                />
              )}
            </View>
            <View style={styles.vehicleTitleContainer}>
              <Text style={styles.plateNumber}>
                {selectedVehicle.plateNumber}
              </Text>
              <Text style={styles.brandModel}>
                {selectedVehicle.brand} {selectedVehicle.model}
              </Text>
              <View style={styles.statusContainer}>
                <FontAwesome
                  name={statusConfig.icon}
                  size={14}
                  color={statusConfig.color}
                />
                <Text style={styles.statusText}>{selectedVehicle.status}</Text>
              </View>
            </View>
          </View>

          {/* Vehicle Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations générales</Text>
            {renderInfoRow(
              "calendar",
              "Année",
              selectedVehicle.year.toString()
            )}
            {renderInfoRow("tint", "Carburant", selectedVehicle.fuelType)}
            {renderInfoRow(
              "users",
              "Capacité",
              `${selectedVehicle.capacity} passagers`
            )}
            {renderInfoRow(
              "road",
              "Kilométrage",
              `${selectedVehicle.mileage.toLocaleString()} km`
            )}
            {renderInfoRow(
              "user",
              "Conducteur assigné",
              selectedVehicle.assignedDriver || "Non assigné"
            )}
          </View>

          {/* Maintenance Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Maintenance</Text>
            {renderInfoRow(
              "wrench",
              "Dernier entretien",
              selectedVehicle.lastMaintenanceDate
            )}
            {renderInfoRow(
              "calendar-plus-o",
              "Prochain entretien",
              selectedVehicle.nextMaintenanceDate,
              true
            )}
          </View>

          {/* Documents & Dates */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Documents & Échéances</Text>
            {renderInfoRow(
              "file-text",
              "Immatriculation",
              selectedVehicle.registrationDate
            )}
            {renderInfoRow(
              "shield",
              "Assurance",
              selectedVehicle.insuranceExpiryDate
            )}
            {renderInfoRow(
              "check-circle",
              "Contrôle technique",
              selectedVehicle.technicalControlDate
            )}
          </View>

          {/* Maintenance History */}
          {selectedVehicle.maintenanceHistory.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Historique des entretiens</Text>
              {selectedVehicle.maintenanceHistory.map((maintenance, index) =>
                renderMaintenanceItem(maintenance, index)
              )}
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
