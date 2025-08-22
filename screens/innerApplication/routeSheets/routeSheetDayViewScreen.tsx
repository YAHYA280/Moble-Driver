import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { DayData } from "../../../shared/types/routeSheet";
import { useRouteSheetStore } from "../../../store/routeSheetStore";
import { KilometrageSection } from "./components/KilometrageSection";
import { ObservationsSection } from "./components/ObservationsSection";
import { OtherTripsSection } from "./components/OtherTripsSection";
import { TimeSlotCard } from "./components/TimeSlotCard";

interface TripData {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

const getDefaultStartTime = (timeSlot: string) => {
  switch (timeSlot) {
    case "Matin":
      return "08:00";
    case "Midi":
      return "12:00";
    case "Après-midi":
      return "14:00";
    case "Soir":
      return "18:00";
    default:
      return "09:00";
  }
};

const getDefaultEndTime = (timeSlot: string) => {
  switch (timeSlot) {
    case "Matin":
      return "11:00";
    case "Midi":
      return "13:30";
    case "Après-midi":
      return "17:00";
    case "Soir":
      return "21:00";
    default:
      return "12:00";
  }
};

export const RouteSheetDayViewScreen: React.FC = () => {
  const { colors } = useTheme();
  const { id, date } = useLocalSearchParams() as {
    id: string;
    date: string;
  };

  // Local state for displaying data (read-only)
  const [dayData, setDayData] = useState<DayData | null>(null);
  const [startKm, setStartKm] = useState("");
  const [endKm, setEndKm] = useState("");
  const [fuelAmount, setFuelAmount] = useState("");
  const [observations, setObservations] = useState("");
  const [otherTrips, setOtherTrips] = useState<TripData[]>([]);

  // Time management for each slot (read-only)
  const [slotTimes, setSlotTimes] = useState<
    Record<string, { start: string; end: string }>
  >({});

  // Animation refs
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  const { routeSheets } = useRouteSheetStore();

  useEffect(() => {
    if (id && date) {
      const routeSheet = routeSheets.find((sheet) => sheet.id === id);
      if (routeSheet) {
        const foundDay = routeSheet.days.find((day) => day.date === date);
        if (foundDay) {
          setDayData(foundDay);

          // Initialize times for each slot (read-only)
          const initialTimes: Record<string, { start: string; end: string }> =
            {};
          foundDay.timeSlots.forEach((slot) => {
            initialTimes[slot.id] = {
              start: getDefaultStartTime(slot.timeSlot),
              end: getDefaultEndTime(slot.timeSlot),
            };
          });
          setSlotTimes(initialTimes);

          // Initialize form with existing data (read-only)
          const activeSlots = foundDay.timeSlots.filter(
            (slot) => slot.isActive
          );
          if (activeSlots.length > 0) {
            const firstSlot = activeSlots[0];
            setStartKm(firstSlot.kilometrage.startKm.toString());
            setEndKm(firstSlot.kilometrage.endKm.toString());
            setObservations(firstSlot.comments || "");

            // Parse other trips if they exist
            if (firstSlot.otherTrips) {
              try {
                const trips = JSON.parse(firstSlot.otherTrips);
                setOtherTrips(trips);
              } catch (error) {
                console.log("Error parsing other trips:", error);
                setOtherTrips([]);
              }
            }
          }
        }
      }
    }

    // Start animations
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [id, date, routeSheets]);

  const getFormattedDate = () => {
    if (!date) return "";
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRouteSheetName = () => {
    if (!id) return "";
    const routeSheet = routeSheets.find((sheet) => sheet.id === id);
    return routeSheet ? routeSheet.monthName : "";
  };

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
      paddingBottom: 50,
    },
    dateText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: 8,
      fontWeight: "500",
    },
    routeSheetText: {
      fontSize: 14,
      color: colors.textTertiary,
      textAlign: "center",
      marginBottom: 20,
      fontStyle: "italic",
    },
    readOnlyBanner: {
      backgroundColor: colors.info + "10",
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      borderLeftWidth: 3,
      borderLeftColor: colors.info,
      borderWidth: 1,
      borderColor: colors.info + "20",
    },
    readOnlyText: {
      fontSize: 15,
      color: colors.info,
      fontWeight: "600",
      textAlign: "center",
      letterSpacing: 0.2,
    },
    disabledSection: {
      opacity: 0.95,
      pointerEvents: "none",
      position: "relative",
    },
    readOnlyOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.surface + "20",
      zIndex: 1,
      borderRadius: 12,
    },
  });

  if (!dayData) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Détail du jour"
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: colors.textSecondary }}>
            Chargement des données...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [
            {
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        }}
      >
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Consultation feuille de route"
          subtitle="Mode lecture seule"
        />
      </Animated.View>

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: contentAnim,
            transform: [
              {
                translateY: contentAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.dateText}>{getFormattedDate()}</Text>
          <Text style={styles.routeSheetText}>
            Feuille de route: {getRouteSheetName()}
          </Text>

          {/* Read-only Banner */}
          <View style={styles.readOnlyBanner}>
            <Text style={styles.readOnlyText}>
              📖 Mode consultation uniquement - Cette feuille de route ne peut
              pas être modifiée
            </Text>
          </View>

          {/* Time Slots - Disabled */}
          <View style={styles.disabledSection}>
            {dayData.timeSlots.map((timeSlot) => (
              <TimeSlotCard
                key={timeSlot.id}
                timeSlot={timeSlot}
                startTime={
                  slotTimes[timeSlot.id]?.start ||
                  getDefaultStartTime(timeSlot.timeSlot)
                }
                endTime={
                  slotTimes[timeSlot.id]?.end ||
                  getDefaultEndTime(timeSlot.timeSlot)
                }
                onToggleActive={() => {}}
                onStartTimePress={() => {}}
                onEndTimePress={() => {}}
                disabled={true}
              />
            ))}
          </View>

          {/* Kilometrage Section - Disabled */}
          <View style={styles.disabledSection}>
            <View style={styles.readOnlyOverlay} />
            <KilometrageSection
              startKm={startKm}
              endKm={endKm}
              fuelAmount={fuelAmount}
              onStartKmChange={() => {}}
              onEndKmChange={() => {}}
              onFuelAmountChange={() => {}}
            />
          </View>

          {/* Other Trips Section - Disabled */}
          <View style={styles.disabledSection}>
            <View style={styles.readOnlyOverlay} />
            <OtherTripsSection
              trips={otherTrips}
              onTripsChange={() => {}}
              disabled={true}
            />
          </View>

          {/* Observations Section - Disabled */}
          <View style={styles.disabledSection}>
            <View style={styles.readOnlyOverlay} />
            <ObservationsSection
              observations={observations}
              onObservationsChange={() => {}}
            />
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
