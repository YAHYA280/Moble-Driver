// screens/innerApplication/geolocation/tripDetailsScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { useGeolocationStore } from "../../../store/geolocationStore";

export const TripDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedDay, setSelectedDay] = useState(24);

  const { trips } = useGeolocationStore();
  const trip = trips.find((t) => t.id === id);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Create styles object first
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    calendarContainer: {
      backgroundColor: colors.surface,
      paddingVertical: 20,
      marginBottom: 20,
    },
    calendarRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 16,
    },
    dayButton: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 8,
      marginHorizontal: 4,
    },
    selectedDayButton: {
      backgroundColor: colors.text,
      borderRadius: 20,
    },
    dayText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
      fontWeight: "500",
    },
    selectedDayText: {
      color: colors.surface,
    },
    dateText: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    selectedDateText: {
      color: colors.surface,
    },
    detailsCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      margin: 16,
      padding: 20,
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
      }),
    },
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastDetailRow: {
      borderBottomWidth: 0,
    },
    detailLabel: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    detailValue: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      textAlign: "right",
      flex: 1,
      marginLeft: 16,
    },
    passengersValue: {
      textAlign: "right",
    },
    statusValueRealized: {
      color: colors.success,
      fontWeight: "700",
    },
    statusValueInProgress: {
      color: colors.success,
      fontWeight: "700",
    },
    statusValueUpcoming: {
      color: colors.info,
      fontWeight: "700",
    },
    statusValueCancelled: {
      color: colors.error,
      fontWeight: "700",
    },
    statusValueCompleted: {
      color: colors.textSecondary,
      fontWeight: "700",
    },
    driverSection: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      margin: 16,
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
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
      }),
    },
    driverAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    avatarText: {
      fontSize: 20,
      fontWeight: "700",
      color: "white",
    },
    driverInfo: {
      flex: 1,
    },
    driverName: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    vehicleInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 2,
    },
    vehicleText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 6,
    },
    plateContainer: {
      backgroundColor: colors.backgroundSecondary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      marginLeft: 12,
    },
    plateText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.text,
      letterSpacing: 1,
    },
    qrButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    errorText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
    },
  });

  // Helper functions defined after styles
  const getStatusColor = () => {
    switch (trip?.status) {
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

  const getStatusText = () => {
    switch (trip?.status) {
      case "Termine":
        return "Réalisé";
      default:
        return trip?.status || "Inconnu";
    }
  };

  const getStatusStyle = () => {
    switch (trip?.status) {
      case "En cours":
        return styles.statusValueInProgress;
      case "A venir":
        return styles.statusValueUpcoming;
      case "Termine":
        return styles.statusValueCompleted;
      case "Annule":
        return styles.statusValueCancelled;
      default:
        return styles.statusValueCompleted;
    }
  };

  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Trajet introuvable"
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Ce trajet n'existe pas</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Mock calendar data
  const days = [
    { day: "Lun", date: 21 },
    { day: "Mar", date: 22 },
    { day: "Mer", date: 23 },
    { day: "Jeu", date: 24 },
    { day: "Ven", date: 25 },
    { day: "Sam", date: 26 },
    { day: "Dim", date: 27 },
  ];

  // Extract passenger names from waypoints
  const getPassengers = () => {
    return trip.points
      .filter((point) => point.type === "waypoint" && point.notes)
      .map((point) => {
        const match = point.notes?.match(/Client: (.+)/);
        return match ? match[1] : "Passager";
      });
  };

  const passengers = getPassengers();

  const DetailRow: React.FC<{
    label: string;
    value: string;
    isLast?: boolean;
    isStatus?: boolean;
  }> = ({ label, value, isLast = false, isStatus = false }) => (
    <View style={[styles.detailRow, isLast && styles.lastDetailRow]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, isStatus && getStatusStyle()]}>
        {value}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Détails trajet les écoles"
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <View style={styles.calendarRow}>
            {days.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayButton,
                  selectedDay === day.date && styles.selectedDayButton,
                ]}
                onPress={() => setSelectedDay(day.date)}
              >
                <Text
                  style={[
                    styles.dayText,
                    selectedDay === day.date && styles.selectedDayText,
                  ]}
                >
                  {day.day}
                </Text>
                <Text
                  style={[
                    styles.dateText,
                    selectedDay === day.date && styles.selectedDateText,
                  ]}
                >
                  {day.date}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Trip Details */}
          <View style={styles.detailsCard}>
            <DetailRow label="Heure du départ" value={trip.startTime} />
            <DetailRow
              label="Heure et de l'arrivée"
              value={trip.endTime || trip.startTime}
            />
            <DetailRow
              label="Lieu du départ"
              value={trip.points[0]?.address.split(",")[0] || "Point de départ"}
            />
            <DetailRow
              label="Destination"
              value={
                trip.points[trip.points.length - 1]?.address.split(",")[0] ||
                "Destination"
              }
            />
            <DetailRow
              label="Durée totale"
              value={trip.actualDuration || trip.estimatedDuration}
            />
            <DetailRow
              label="Distance parcourue"
              value={`${trip.distance} Km`}
            />
            <DetailRow
              label="Usagers"
              value={
                passengers.length > 0 ? passengers.join("\n") : "Aucun passager"
              }
            />
            <DetailRow
              label="Status"
              value={getStatusText()}
              isLast={true}
              isStatus={true}
            />
          </View>

          {/* Driver Info */}
          <View style={styles.driverSection}>
            <View style={styles.driverAvatar}>
              <Text style={styles.avatarText}>DJ</Text>
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>David Jacques</Text>
              <View style={styles.vehicleInfo}>
                <Ionicons name="car" size={16} color={colors.textSecondary} />
                <Text style={styles.vehicleText}>Mercedes Benz</Text>
                <View style={styles.plateContainer}>
                  <Text style={styles.plateText}>{trip.vehicleId}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.qrButton}>
              <Ionicons name="qr-code" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
