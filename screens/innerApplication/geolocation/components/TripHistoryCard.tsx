// screens/innerApplication/geolocation/components/TripHistoryCard.tsx
import { useThemeColors } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Trip } from "../../../../shared/types/geolocation";

interface TripHistoryCardProps {
  trip: Trip;
  onPress: () => void;
}

export const TripHistoryCard: React.FC<TripHistoryCardProps> = ({
  trip,
  onPress,
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

  // Format date from trip startTime
  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 6,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    leftContent: {
      flex: 1,
      marginRight: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 6,
    },
    dateTime: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    startTime: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
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
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.leftContent}>
          <Text style={styles.title} numberOfLines={1}>
            {trip.title}
          </Text>
          <Text style={styles.dateTime}>{formatDate()}</Text>
          <Text style={styles.startTime}>Départ: {trip.startTime}</Text>
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
    </TouchableOpacity>
  );
};
