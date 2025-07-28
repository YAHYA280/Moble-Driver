// screens/innerApplication/planning/agendaViewScreen.tsx
import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
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
import {
  TRIP_STATUS_LABELS,
  TRIP_TYPE_COLORS,
  Trip,
} from "../../../shared/types/planning";
import { usePlanningStore } from "../../../store/planningStore";
import { LAYOUT_CONFIG, PLANNING_CONFIG } from "./constants/planningConstants";
import { formatDate, formatTime, getWeekDays } from "./utils/planningUtils";

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    content: {
      flex: 1,
    },
    weekContainer: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      paddingVertical: 8,
      paddingHorizontal: 4,
      marginHorizontal: 16,
      marginTop: 8,
      borderRadius: 12,
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
    dayItem: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderRadius: 8,
    },
    selectedDayItem: {
      backgroundColor: colors.primary,
    },
    dayName: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.textSecondary,
      marginBottom: 4,
    },
    selectedDayName: {
      color: "#ffffff",
    },
    dayNumber: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    selectedDayNumber: {
      color: "#ffffff",
    },
    agendaContainer: {
      flex: 1,
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 16,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: colors.isDark ? 0.3 : 0.12,
          shadowRadius: 16,
        },
        android: {
          elevation: 8,
        },
        web: {
          boxShadow: colors.isDark
            ? "0 4px 16px rgba(0, 0, 0, 0.3)"
            : "0 4px 16px rgba(0, 0, 0, 0.12)",
        },
      }),
    },
    agendaHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "30",
    },
    agendaTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    agendaSubtitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    tripsList: {
      flex: 1,
    },
    tripsListContent: {
      paddingBottom: 150,
    },
    tripItem: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "20",
    },
    timeContainer: {
      width: LAYOUT_CONFIG.TIME_CONTAINER_WIDTH,
      alignItems: "flex-start",
      paddingTop: 4,
    },
    timeText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    timeSubText: {
      fontSize: 12,
      fontWeight: "400",
      color: colors.textSecondary,
      marginTop: 2,
    },
    tripCard: {
      flex: 1,
      marginLeft: 16,
      borderRadius: 12,
      padding: 16,
      borderLeftWidth: 4,
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
    tripTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 4,
    },
    tripRoute: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    tripRouteText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginLeft: 4,
    },
    tripVehicle: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },
    tripVehicleText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 4,
    },
    tripStatus: {
      flexDirection: "row",
      alignItems: "center",
    },
    tripStatusIcon: {
      marginRight: 4,
    },
    tripStatusText: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.textSecondary,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
    },
    emptyIcon: {
      fontSize: LAYOUT_CONFIG.EMPTY_ICON_SIZE,
      marginBottom: 16,
      opacity: 0.5,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
  });

export const AgendaViewScreen: React.FC = () => {
  const { colors } = useTheme();
  const { date } = useLocalSearchParams<{ date: string }>();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { getTripsForDate, selectTrip, isLoading } = usePlanningStore();

  const trips = date ? getTripsForDate(date) : [];

  // Get styles with current theme colors
  const styles = createStyles(colors);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: PLANNING_CONFIG.ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleTripPress = (trip: Trip) => {
    selectTrip(trip);
    router.push(`/(tabs)/planning/trip/${trip.id}`);
  };

  const weekDays = date ? getWeekDays(date) : [];
  const selectedDateFormatted = date
    ? formatDate(date)
    : { day: "", dayName: "" };

  const renderTrip = (trip: Trip, index: number) => {
    const typeColor = TRIP_TYPE_COLORS[trip.type];
    const startTime = formatTime(trip.startTime);
    const endTime = formatTime(trip.endTime);

    return (
      <TouchableOpacity
        key={trip.id}
        style={styles.tripItem}
        onPress={() => handleTripPress(trip)}
        activeOpacity={0.7}
      >
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{startTime}</Text>
          <Text style={styles.timeSubText}>{endTime}</Text>
        </View>

        <View
          style={[
            styles.tripCard,
            {
              backgroundColor: typeColor + "15",
              borderLeftColor: typeColor,
            },
          ]}
        >
          <Text style={[styles.tripTitle, { color: typeColor }]}>
            {trip.title}
          </Text>

          <View style={styles.tripRoute}>
            <FontAwesome name="road" size={12} color={colors.textSecondary} />
            <Text style={styles.tripRouteText}>
              {trip.startLocation} → {trip.endLocation}
            </Text>
          </View>

          <ConditionalComponent isValid={!!trip.assignedVehicle}>
            <View style={styles.tripVehicle}>
              <FontAwesome name="car" size={12} color={colors.textSecondary} />
              <Text style={styles.tripVehicleText}>
                {trip.assignedVehicle?.plateNumber}
              </Text>
            </View>
          </ConditionalComponent>

          <View style={styles.tripStatus}>
            <FontAwesome
              name="circle"
              size={8}
              color={typeColor}
              style={styles.tripStatusIcon}
            />
            <Text style={styles.tripStatusText}>
              {TRIP_STATUS_LABELS[trip.status]}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Agenda du jour"
        rightIcons={[
          {
            icon: "calendar",
            onPress: () => router.back(),
          },
        ]}
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Week days navigation */}
        <View style={styles.weekContainer}>
          {weekDays.map((day, index) => {
            const dayFormatted = formatDate(day.toISOString().split("T")[0]);
            const isSelected = day.toISOString().split("T")[0] === date;

            return (
              <TouchableOpacity
                key={index}
                style={[styles.dayItem, isSelected && styles.selectedDayItem]}
                onPress={() => {
                  const newDate = day.toISOString().split("T")[0];
                  router.setParams({ date: newDate });
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.dayName, isSelected && styles.selectedDayName]}
                >
                  {dayFormatted.dayName}
                </Text>
                <Text
                  style={[
                    styles.dayNumber,
                    isSelected && styles.selectedDayNumber,
                  ]}
                >
                  {dayFormatted.day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Agenda container */}
        <View style={styles.agendaContainer}>
          <View style={styles.agendaHeader}>
            <View>
              <Text style={styles.agendaTitle}>Heure</Text>
            </View>
            <View>
              <Text style={styles.agendaSubtitle}>Trajets</Text>
            </View>
          </View>

          <ScrollView
            style={styles.tripsList}
            contentContainerStyle={styles.tripsListContent}
            showsVerticalScrollIndicator={false}
          >
            <ConditionalComponent
              isValid={trips.length > 0}
              defaultComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>🚌</Text>
                  <Text style={styles.emptyTitle}>Aucun trajet</Text>
                  <Text style={styles.emptyText}>
                    Vous n&apos;avez aucun trajet prévu pour cette date.
                  </Text>
                </View>
              }
            >
              {trips.map((trip, index) => renderTrip(trip, index))}
            </ConditionalComponent>
          </ScrollView>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};
