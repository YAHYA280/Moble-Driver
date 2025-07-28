// screens/innerApplication/planning/components/tripDetails/RouteSection.tsx
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../../contexts/ThemeContext";
import { Trip } from "../../../../../shared/types/planning";

interface RouteSectionProps {
  trip: Trip;
}

const styles = StyleSheet.create({
  routeSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  routeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  routeIcon: {
    marginRight: 8,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  locationContainer: {
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  locationSubtext: {
    fontSize: 12,
    opacity: 0.7,
  },
  routeLine: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  startDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#746cd4",
    marginRight: 8,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: "#746cd4",
    marginHorizontal: 8,
  },
  distanceBadge: {
    backgroundColor: "#746cd4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 12,
  },
  distanceText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

export const RouteSection: React.FC<RouteSectionProps> = ({ trip }) => {
  const { colors } = useTheme();

  const dynamicStyles = {
    routeSection: {
      ...styles.routeSection,
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
    routeTitle: {
      ...styles.routeTitle,
      color: colors.text,
    },
    locationText: {
      ...styles.locationText,
      color: colors.text,
    },
    locationSubtext: {
      ...styles.locationSubtext,
      color: colors.textSecondary,
    },
  };

  return (
    <View style={dynamicStyles.routeSection}>
      <View style={styles.routeHeader}>
        <FontAwesome
          name="map-marker"
          size={18}
          color={colors.error}
          style={styles.routeIcon}
        />
        <Text style={dynamicStyles.routeTitle}>Point de Départ</Text>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.locationContainer}>
          <Text style={dynamicStyles.locationText}>{trip.startLocation}</Text>
          <Text style={dynamicStyles.locationSubtext}>
            {trip.startLocation}
          </Text>
        </View>

        <View style={styles.locationContainer}>
          <Text style={[dynamicStyles.locationText, { textAlign: "right" }]}>
            {trip.endLocation}
          </Text>
          <Text style={[dynamicStyles.locationSubtext, { textAlign: "right" }]}>
            {trip.endLocation}
          </Text>
        </View>
      </View>

      <View style={styles.routeLine}>
        <View style={styles.startDot} />
        <View style={styles.line} />
        <FontAwesome name="graduation-cap" size={16} color="#746cd4" />
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>20 km</Text>
        </View>
      </View>
    </View>
  );
};
