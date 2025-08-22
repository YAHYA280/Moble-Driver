import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
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
import {
  TRIP_STATUS_LABELS,
  TRIP_TYPE_COLORS,
  TRIP_TYPE_LABELS,
  Trip,
} from "../../../../shared/types/planning";

interface TripCardProps {
  trip: Trip;
  onPress: () => void;
  style?: ViewStyle;
  showDate?: boolean;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  onPress,
  style,
  showDate = false,
}) => {
  const colors = useThemeColors();

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Remove seconds if present
  };

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getStatusColor = () => {
    switch (trip.status) {
      case "prevu":
        return colors.warning;
      case "en_cours":
        return colors.info;
      case "termine":
        return colors.success;
      case "annule":
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const typeColor = TRIP_TYPE_COLORS[trip.type];

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 4,
      borderRadius: 12,
      backgroundColor: colors.card,
      borderLeftWidth: 4,
      borderLeftColor: typeColor,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
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
      backgroundColor: typeColor + "20",
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    tripTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      flex: 1,
      marginRight: 8,
    },
    typeLabel: {
      fontSize: 12,
      fontWeight: "500",
      color: typeColor,
      backgroundColor: typeColor + "15",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
    },
    timeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    timeText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginRight: 12,
    },
    dateText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginRight: 12,
    },
    routeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    routeIcon: {
      marginRight: 6,
    },
    routeText: {
      fontSize: 13,
      color: colors.textTertiary,
      flex: 1,
    },
    detailsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    leftDetails: {
      flexDirection: "row",
      alignItems: "center",
    },
    vehicleInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 12,
    },
    vehicleIcon: {
      marginRight: 4,
    },
    vehicleText: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: "500",
    },
    passengersInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    passengersIcon: {
      marginRight: 4,
    },
    passengersText: {
      fontSize: 12,
      color: colors.textTertiary,
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "500",
    },
  });

  const getTripIcon = () => {
    switch (trip.type) {
      case "ecole":
        return "graduation-cap";
      case "transport":
        return "bus";
      case "maintenance":
        return "wrench";
      default:
        return "map-marker";
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left Icon */}
      <View style={styles.iconContainer}>
        <FontAwesome name={getTripIcon()} size={20} color={typeColor} />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.tripTitle} numberOfLines={1}>
            {trip.title}
          </Text>
          <Text style={styles.typeLabel}>{TRIP_TYPE_LABELS[trip.type]}</Text>
        </View>

        <View style={styles.timeRow}>
          <ConditionalComponent isValid={showDate}>
            <Text style={styles.dateText}>{formatDate(trip.date)}</Text>
          </ConditionalComponent>
          <Text style={styles.timeText}>
            {formatTime(trip.startTime)} - {formatTime(trip.endTime)}
          </Text>
        </View>

        <View style={styles.routeRow}>
          <FontAwesome
            name="road"
            size={12}
            color={colors.textTertiary}
            style={styles.routeIcon}
          />
          <Text style={styles.routeText} numberOfLines={1}>
            {trip.startLocation} → {trip.endLocation}
          </Text>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.leftDetails}>
            <ConditionalComponent isValid={!!trip.assignedVehicle}>
              <View style={styles.vehicleInfo}>
                <FontAwesome
                  name="car"
                  size={12}
                  color={colors.textTertiary}
                  style={styles.vehicleIcon}
                />
                <Text style={styles.vehicleText}>
                  {trip.assignedVehicle?.plateNumber}
                </Text>
              </View>
            </ConditionalComponent>

            <View style={styles.passengersInfo}>
              <FontAwesome
                name="users"
                size={12}
                color={colors.textTertiary}
                style={styles.passengersIcon}
              />
              <Text style={styles.passengersText}>
                {trip.confirmedPassengers}/{trip.totalPassengers}
              </Text>
            </View>
          </View>

          <View style={styles.statusContainer}>
            <View
              style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
            />
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {TRIP_STATUS_LABELS[trip.status]}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
