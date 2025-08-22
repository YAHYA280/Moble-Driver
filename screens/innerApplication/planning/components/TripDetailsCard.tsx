import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import {
  TRIP_STATUS_LABELS,
  TRIP_TYPE_COLORS,
  TRIP_TYPE_LABELS,
  Trip,
} from "../../../../shared/types/planning";

interface TripDetailsCardProps {
  trip: Trip;
}

const formatTime = (time: string) => time.substring(0, 5);

const formatDate = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  detailIcon: {
    width: 24,
    marginRight: 16,
    alignItems: "center",
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  detailSubValue: {
    fontSize: 14,
    marginTop: 2,
  },
  stopsContainer: {
    marginTop: 8,
  },
  stopItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  stopDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  stopText: {
    fontSize: 14,
    flex: 1,
  },
  stopTime: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 8,
  },
});

export const TripDetailsCard: React.FC<TripDetailsCardProps> = ({ trip }) => {
  const colors = useThemeColors();

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

  const dynamicStyles = {
    card: {
      ...styles.card,
      backgroundColor: colors.card,
      borderLeftColor: typeColor,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.3 : 0.12,
          shadowRadius: 16,
        },
        android: { elevation: 8 },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 16px rgba(0, 0, 0, 0.3)"
            : "0 4px 16px rgba(0, 0, 0, 0.12)",
        },
      }),
    },
    icon: {
      ...styles.icon,
      backgroundColor: typeColor + "20",
    },
    title: {
      ...styles.title,
      color: colors.text,
    },
    type: {
      ...styles.type,
      color: typeColor,
      backgroundColor: typeColor + "15",
    },
    statusText: {
      ...styles.statusText,
      color: getStatusColor(),
    },
    statusDot: {
      ...styles.statusDot,
      backgroundColor: getStatusColor(),
    },
    detailRow: {
      ...styles.detailRow,
      borderBottomColor: colors.border + "30",
    },
    detailLabel: {
      ...styles.detailLabel,
      color: colors.textSecondary,
    },
    detailValue: {
      ...styles.detailValue,
      color: colors.text,
    },
    detailSubValue: {
      ...styles.detailSubValue,
      color: colors.textSecondary,
    },
    stopText: {
      ...styles.stopText,
      color: colors.text,
    },
    stopTime: {
      ...styles.stopTime,
      color: colors.textSecondary,
    },
  };

  return (
    <View style={dynamicStyles.card}>
      <View style={styles.header}>
        <View style={dynamicStyles.icon}>
          <FontAwesome name={getTripIcon()} size={24} color={typeColor} />
        </View>
        <View style={styles.info}>
          <Text style={dynamicStyles.title}>{trip.title}</Text>
          <Text style={dynamicStyles.type}>{TRIP_TYPE_LABELS[trip.type]}</Text>
          <View style={styles.statusContainer}>
            <View style={dynamicStyles.statusDot} />
            <Text style={dynamicStyles.statusText}>
              {TRIP_STATUS_LABELS[trip.status]}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <View style={dynamicStyles.detailRow}>
          <View style={styles.detailIcon}>
            <FontAwesome
              name="calendar-o"
              size={16}
              color={colors.textSecondary}
            />
          </View>
          <View style={styles.detailContent}>
            <Text style={dynamicStyles.detailLabel}>Date</Text>
            <Text style={dynamicStyles.detailValue}>
              {formatDate(trip.date)}
            </Text>
          </View>
        </View>

        <View style={dynamicStyles.detailRow}>
          <View style={styles.detailIcon}>
            <FontAwesome
              name="clock-o"
              size={16}
              color={colors.textSecondary}
            />
          </View>
          <View style={styles.detailContent}>
            <Text style={dynamicStyles.detailLabel}>Horaire</Text>
            <Text style={dynamicStyles.detailValue}>
              {formatTime(trip.startTime)} - {formatTime(trip.endTime)}
            </Text>
          </View>
        </View>

        <View style={dynamicStyles.detailRow}>
          <View style={styles.detailIcon}>
            <FontAwesome name="road" size={16} color={colors.textSecondary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={dynamicStyles.detailLabel}>Itinéraire</Text>
            <Text style={dynamicStyles.detailValue}>
              {trip.startLocation} → {trip.endLocation}
            </Text>
            <ConditionalComponent isValid={trip.stops.length > 0}>
              <View style={styles.stopsContainer}>
                <Text style={dynamicStyles.detailSubValue}>Arrêts:</Text>
                {trip.stops.map((stop, index) => (
                  <View key={stop.id} style={styles.stopItem}>
                    <View
                      style={[styles.stopDot, { backgroundColor: typeColor }]}
                    />
                    <Text style={dynamicStyles.stopText}>{stop.name}</Text>
                    <Text style={dynamicStyles.stopTime}>
                      {formatTime(stop.arrivalTime)}
                    </Text>
                  </View>
                ))}
              </View>
            </ConditionalComponent>
          </View>
        </View>

        <ConditionalComponent isValid={!!trip.assignedVehicle}>
          <View style={dynamicStyles.detailRow}>
            <View style={styles.detailIcon}>
              <FontAwesome name="car" size={16} color={colors.textSecondary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={dynamicStyles.detailLabel}>Véhicule</Text>
              <Text style={dynamicStyles.detailValue}>
                {trip.assignedVehicle?.plateNumber}
              </Text>
              <Text style={dynamicStyles.detailSubValue}>
                {trip.assignedVehicle?.brand} {trip.assignedVehicle?.model}
              </Text>
            </View>
          </View>
        </ConditionalComponent>

        <View style={dynamicStyles.detailRow}>
          <View style={styles.detailIcon}>
            <FontAwesome name="users" size={16} color={colors.textSecondary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={dynamicStyles.detailLabel}>Passagers</Text>
            <Text style={dynamicStyles.detailValue}>
              {trip.confirmedPassengers}/{trip.totalPassengers}
            </Text>
            <Text style={dynamicStyles.detailSubValue}>
              {trip.confirmedPassengers} confirmé(s)
            </Text>
          </View>
        </View>

        <ConditionalComponent isValid={!!trip.notes}>
          <View style={dynamicStyles.detailRow}>
            <View style={styles.detailIcon}>
              <FontAwesome
                name="sticky-note-o"
                size={16}
                color={colors.textSecondary}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={dynamicStyles.detailLabel}>Notes</Text>
              <Text style={dynamicStyles.detailValue}>{trip.notes}</Text>
            </View>
          </View>
        </ConditionalComponent>
      </View>
    </View>
  );
};
