// screens/innerApplication/incidents/components/IncidentVehicleCard.tsx
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
import { Incident } from "../../../../shared/types/incident";
import { useVehicleStore } from "../../../../store/vehicleStore";

interface IncidentVehicleCardProps {
  incident: Incident;
  style?: ViewStyle;
}

export const IncidentVehicleCard: React.FC<IncidentVehicleCardProps> = ({
  incident,
  style,
}) => {
  const colors = useThemeColors();
  const { vehicles } = useVehicleStore();

  // Find the vehicle associated with this incident
  const associatedVehicle = vehicles.find((v) => v.id === incident.vehicleId);

  const handleViewVehicleDetails = () => {
    // In a real app, this would navigate to vehicle details
    console.log("Navigate to vehicle details:", incident.vehicleId);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 16,
      marginBottom: 12,
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
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    vehicleIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    headerContent: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    plateNumber: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.primary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    viewButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.primary + "15",
      flexDirection: "row",
      alignItems: "center",
    },
    viewButtonText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.primary,
      marginRight: 6,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 16,
    },
    detailsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
    },
    detailItem: {
      flex: 1,
      minWidth: "45%",
    },
    detailLabel: {
      fontSize: 13,
      color: colors.textTertiary,
      fontWeight: "500",
      marginBottom: 4,
    },
    detailValue: {
      fontSize: 15,
      color: colors.text,
      fontWeight: "600",
    },
    warningNote: {
      backgroundColor: colors.warning + "10",
      borderLeftWidth: 4,
      borderLeftColor: colors.warning,
      padding: 12,
      borderRadius: 8,
      marginTop: 16,
    },
    warningText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.vehicleIcon}>
            <FontAwesome name="car" size={20} color={colors.primary} />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Véhicule concerné</Text>
            <Text style={styles.plateNumber}>
              {incident.vehiclePlateNumber}
            </Text>
            {associatedVehicle && (
              <Text style={styles.subtitle}>
                {associatedVehicle.brand} {associatedVehicle.model}
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={handleViewVehicleDetails}
          activeOpacity={0.7}
        >
          <Text style={styles.viewButtonText}>Voir détails</Text>
          <FontAwesome name="chevron-right" size={12} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {associatedVehicle && (
        <>
          <View style={styles.divider} />

          {/* Vehicle Details */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Matricule</Text>
              <Text style={styles.detailValue}>
                {associatedVehicle.plateNumber}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Statut actuel</Text>
              <Text style={styles.detailValue}>{associatedVehicle.status}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Marque</Text>
              <Text style={styles.detailValue}>{associatedVehicle.brand}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Modèle</Text>
              <Text style={styles.detailValue}>{associatedVehicle.model}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Année</Text>
              <Text style={styles.detailValue}>{associatedVehicle.year}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Kilométrage</Text>
              <Text style={styles.detailValue}>
                {associatedVehicle.mileage.toLocaleString()} km
              </Text>
            </View>
            {associatedVehicle.assignedDriver && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Conducteur assigné</Text>
                <Text style={styles.detailValue}>
                  {associatedVehicle.assignedDriver}
                </Text>
              </View>
            )}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Dernier entretien</Text>
              <Text style={styles.detailValue}>
                {associatedVehicle.lastMaintenanceDate}
              </Text>
            </View>
          </View>

          {/* Warning note if vehicle is out of service */}
          {associatedVehicle.status === "Hors service" && (
            <View style={styles.warningNote}>
              <Text style={styles.warningText}>
                ⚠️ Ce véhicule est actuellement hors service. L&apos;incident
                pourrait être lié à cette situation.
              </Text>
            </View>
          )}
        </>
      )}

      {!associatedVehicle && (
        <View style={styles.warningNote}>
          <Text style={styles.warningText}>
            ℹ️ Les informations détaillées du véhicule ne sont pas disponibles
            actuellement.
          </Text>
        </View>
      )}
    </View>
  );
};
