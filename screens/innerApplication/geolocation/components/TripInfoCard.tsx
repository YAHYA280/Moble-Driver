import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Trip } from "../../../../shared/types/geolocation";

interface TripInfoCardProps {
  trip: Trip;
  onDetailsPress?: () => void;
  onNavigatePress?: () => void;
}

export const TripInfoCard: React.FC<TripInfoCardProps> = ({
  trip,
  onDetailsPress,
  onNavigatePress,
}) => {
  const colors = useThemeColors();

  const getStatusColor = () => {
    switch (trip.status) {
      case "En cours":
        return colors.success;
      case "A venir":
        return colors.info;
      case "Termine":
        return colors.textSecondary;
      case "Annule":
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = () => {
    switch (trip.status) {
      case "En cours":
        return "play-circle";
      case "A venir":
        return "time";
      case "Termine":
        return "checkmark-circle";
      case "Annule":
        return "close-circle";
      default:
        return "help-circle";
    }
  };

  const nextPoint = trip.points.find(
    (p) => p.type === (trip.status === "En cours" ? "destination" : "pickup")
  );

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 8,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.3 : 0.12,
          shadowRadius: 12,
        },
        android: {
          elevation: 8,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 12px rgba(0, 0, 0, 0.3)"
            : "0 4px 12px rgba(0, 0, 0, 0.12)",
        },
      }),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    titleContainer: {
      flex: 1,
      marginRight: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: getStatusColor() + "15",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
      color: getStatusColor(),
      marginLeft: 4,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    infoIcon: {
      marginRight: 8,
      width: 20,
      textAlign: "center",
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      color: colors.textSecondary,
    },
    actionsRow: {
      flexDirection: "row",
      marginTop: 12,
      gap: 12,
    },
    actionButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: colors.primary + "15",
    },
    primaryActionButton: {
      backgroundColor: colors.primary,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.primary,
      marginLeft: 6,
    },
    primaryActionButtonText: {
      color: "white",
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {trip.title}
          </Text>
          <ConditionalComponent isValid={!!trip.customerInfo?.name}>
            <Text style={styles.subtitle} numberOfLines={1}>
              {trip.customerInfo?.name}
            </Text>
          </ConditionalComponent>
        </View>

        <View style={styles.statusContainer}>
          <Ionicons
            name={getStatusIcon() as any}
            size={14}
            color={getStatusColor()}
          />
          <Text style={styles.statusText}>{trip.status}</Text>
        </View>
      </View>

      {/* Trip Info */}
      <View style={styles.infoRow}>
        <Ionicons
          name="time-outline"
          size={16}
          color={colors.textSecondary}
          style={styles.infoIcon}
        />
        <Text style={styles.infoText}>
          Début: {trip.startTime} • Durée: {trip.estimatedDuration}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons
          name="speedometer-outline"
          size={16}
          color={colors.textSecondary}
          style={styles.infoIcon}
        />
        <Text style={styles.infoText}>Distance: {trip.distance} km</Text>
      </View>

      <ConditionalComponent isValid={!!nextPoint}>
        <View style={styles.infoRow}>
          <Ionicons
            name="location-outline"
            size={16}
            color={colors.textSecondary}
            style={styles.infoIcon}
          />
          <Text style={styles.infoText} numberOfLines={1}>
            {nextPoint?.type === "pickup" ? "Ramassage" : "Destination"}:{" "}
            {nextPoint?.address}
          </Text>
        </View>
      </ConditionalComponent>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onDetailsPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={colors.primary}
          />
          <Text style={styles.actionButtonText}>Détails</Text>
        </TouchableOpacity>

        <ConditionalComponent
          isValid={trip.status === "En cours" || trip.status === "A venir"}
        >
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryActionButton]}
            onPress={onNavigatePress}
            activeOpacity={0.7}
          >
            <Ionicons name="navigate" size={16} color="white" />
            <Text
              style={[styles.actionButtonText, styles.primaryActionButtonText]}
            >
              Navigation
            </Text>
          </TouchableOpacity>
        </ConditionalComponent>
      </View>
    </View>
  );
};
