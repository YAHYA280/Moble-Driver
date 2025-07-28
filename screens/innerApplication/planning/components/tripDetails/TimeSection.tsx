// screens/innerApplication/planning/components/tripDetails/TimeSection.tsx
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../../contexts/ThemeContext";
import { Trip } from "../../../../../shared/types/planning";

interface TimeSectionProps {
  trip: Trip;
}

const styles = StyleSheet.create({
  timeSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  timeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  timeTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  timeBox: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#746cd4",
  },
  timeValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#746cd4",
  },
  timeArrow: {
    marginHorizontal: 20,
  },
});

export const TimeSection: React.FC<TimeSectionProps> = ({ trip }) => {
  const { colors } = useTheme();

  const formatTime = (time: string) => time.substring(0, 5);

  const dynamicStyles = {
    timeSection: {
      ...styles.timeSection,
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
    timeTitle: {
      ...styles.timeTitle,
      color: colors.text,
    },
  };

  return (
    <View style={dynamicStyles.timeSection}>
      <View style={styles.timeHeader}>
        <FontAwesome name="clock-o" size={18} color={colors.textSecondary} />
        <Text style={dynamicStyles.timeTitle}>
          Heures de Départ et d&apos;Arrivé
        </Text>
      </View>

      <View style={styles.timeContainer}>
        <View style={styles.timeBox}>
          <Text style={styles.timeLabel}>De</Text>
          <Text style={styles.timeValue}>{formatTime(trip.startTime)}</Text>
        </View>

        <FontAwesome
          name="chevron-right"
          size={20}
          color="#746cd4"
          style={styles.timeArrow}
        />

        <View style={styles.timeBox}>
          <Text style={styles.timeLabel}>À</Text>
          <Text style={styles.timeValue}>{formatTime(trip.endTime)}</Text>
        </View>
      </View>
    </View>
  );
};
