import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Button } from "../../../shared/components/ui/Button";
import { Header } from "../../../shared/components/ui/Header";
import { DayData, TimeSlotData } from "../../../shared/types/routeSheet";
import { useRouteSheetStore } from "../../../store/routeSheetStore";
import { CustomTimePicker } from "./components/CustomTimePicker";
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

export const RouteSheetEditScreen: React.FC = () => {
  const { colors } = useTheme();
  const { id, date } = useLocalSearchParams<{ id: string; date?: string }>();

  // Local state for form data
  const [dayData, setDayData] = useState<DayData | null>(null);
  const [startKm, setStartKm] = useState("");
  const [endKm, setEndKm] = useState("");
  const [fuelAmount, setFuelAmount] = useState("");
  const [observations, setObservations] = useState("");
  const [otherTrips, setOtherTrips] = useState<TripData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Time picker state
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlotData | null>(
    null
  );
  const [timePickerType, setTimePickerType] = useState<"start" | "end">(
    "start"
  );
  const [timePickerTitle, setTimePickerTitle] = useState("");
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // Time management for each slot
  const [slotTimes, setSlotTimes] = useState<
    Record<string, { start: string; end: string }>
  >({});

  // Animation refs
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  const { currentRouteSheet, updateTimeSlotData, saveDayData } =
    useRouteSheetStore();

  useEffect(() => {
    if (currentRouteSheet && date) {
      const foundDay = currentRouteSheet.days.find((day) => day.date === date);
      if (foundDay) {
        setDayData(foundDay);

        // Initialize times for each slot
        const initialTimes: Record<string, { start: string; end: string }> = {};
        foundDay.timeSlots.forEach((slot) => {
          initialTimes[slot.id] = {
            start: getDefaultStartTime(slot.timeSlot),
            end: getDefaultEndTime(slot.timeSlot),
          };
        });
        setSlotTimes(initialTimes);

        // Initialize form with existing data if any
        const activeSlots = foundDay.timeSlots.filter((slot) => slot.isActive);
        if (activeSlots.length > 0) {
          const firstSlot = activeSlots[0];
          setStartKm(firstSlot.kilometrage.startKm.toString());
          setEndKm(firstSlot.kilometrage.endKm.toString());
          setObservations(firstSlot.comments || "");
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
  }, [currentRouteSheet, date]);

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

  const handleTimeSlotToggle = async (timeSlot: TimeSlotData) => {
    if (!dayData || !date) return;

    const updatedTimeSlots = dayData.timeSlots.map((slot) =>
      slot.id === timeSlot.id ? { ...slot, isActive: !slot.isActive } : slot
    );

    const updatedDayData = { ...dayData, timeSlots: updatedTimeSlots };
    setDayData(updatedDayData);

    try {
      await updateTimeSlotData(date, timeSlot.timeSlot, {
        isActive: !timeSlot.isActive,
      });
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour le créneau horaire.");
    }
  };

  const handleTimePress = (timeSlot: TimeSlotData, type: "start" | "end") => {
    setSelectedTimeSlot(timeSlot);
    setSelectedTripId(null);
    setTimePickerType(type);
    setTimePickerTitle(
      `${type === "start" ? "Début" : "Fin"} - ${timeSlot.timeSlot}`
    );
    setTimePickerVisible(true);
  };

  const handleTripTimePress = (
    tripId: string,
    field: "startTime" | "endTime"
  ) => {
    setSelectedTimeSlot(null);
    setSelectedTripId(tripId);
    setTimePickerType(field === "startTime" ? "start" : "end");
    const trip = otherTrips.find((t) => t.id === tripId);
    setTimePickerTitle(
      `${field === "startTime" ? "Début" : "Fin"} - ${trip?.name || "Trajet"}`
    );
    setTimePickerVisible(true);
  };

  const handleTimeSelect = (selectedTime: string) => {
    if (selectedTimeSlot) {
      // Update time slot time
      setSlotTimes((prev) => ({
        ...prev,
        [selectedTimeSlot.id]: {
          ...prev[selectedTimeSlot.id],
          [timePickerType === "start" ? "start" : "end"]: selectedTime,
        },
      }));
    } else if (selectedTripId) {
      // Update trip time
      setOtherTrips((prev) =>
        prev.map((trip) =>
          trip.id === selectedTripId
            ? {
                ...trip,
                [timePickerType === "start" ? "startTime" : "endTime"]:
                  selectedTime,
              }
            : trip
        )
      );
    }
  };

  const handleSave = async () => {
    if (!dayData || !date) return;

    setIsLoading(true);

    try {
      const activeSlots = dayData.timeSlots.filter((slot) => slot.isActive);

      if (activeSlots.length === 0) {
        Alert.alert(
          "Attention",
          "Veuillez sélectionner au moins un créneau horaire."
        );
        setIsLoading(false);
        return;
      }

      if (!startKm || !endKm) {
        Alert.alert(
          "Attention",
          "Veuillez remplir les kilométrages de début et fin."
        );
        setIsLoading(false);
        return;
      }

      const startKmNum = parseFloat(startKm);
      const endKmNum = parseFloat(endKm);

      if (endKmNum <= startKmNum) {
        Alert.alert(
          "Erreur",
          "Le kilométrage de fin doit être supérieur au kilométrage de début."
        );
        setIsLoading(false);
        return;
      }

      // Update the first active slot with data
      const updatedTimeSlots = dayData.timeSlots.map((slot) => {
        if (slot.isActive && slot.id === activeSlots[0].id) {
          return {
            ...slot,
            kilometrage: {
              startKm: startKmNum,
              endKm: endKmNum,
            },
            comments: observations,
            otherTrips: otherTrips.length > 0 ? JSON.stringify(otherTrips) : "",
            isCompleted: true,
          };
        }
        return slot;
      });

      const updatedDayData: DayData = {
        ...dayData,
        timeSlots: updatedTimeSlots,
        isCompleted: true,
      };

      await saveDayData(date, updatedDayData);

      Alert.alert("Succès", "Feuille de route sauvegardée avec succès.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de sauvegarder la feuille de route.");
    } finally {
      setIsLoading(false);
    }
  };

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
      marginBottom: 20,
      fontWeight: "500",
    },
    saveButtonContainer: {
      marginTop: 20,
      marginBottom: 40,
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
          title="Feuille de route"
        />
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
          title="Ajout de feuille de route de chaque mois"
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

          {/* Time Slots */}
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
              onToggleActive={() => handleTimeSlotToggle(timeSlot)}
              onStartTimePress={() => handleTimePress(timeSlot, "start")}
              onEndTimePress={() => handleTimePress(timeSlot, "end")}
            />
          ))}

          {/* Kilometrage Section */}
          <KilometrageSection
            startKm={startKm}
            endKm={endKm}
            fuelAmount={fuelAmount}
            onStartKmChange={setStartKm}
            onEndKmChange={setEndKm}
            onFuelAmountChange={setFuelAmount}
          />

          {/* Other Trips Section */}
          <OtherTripsSection
            trips={otherTrips}
            onTripsChange={setOtherTrips}
            onTimePress={handleTripTimePress}
          />

          {/* Observations Section */}
          <ObservationsSection
            observations={observations}
            onObservationsChange={setObservations}
          />

          {/* Save Button inside scroll view */}
          <View style={styles.saveButtonContainer}>
            <Button
              title="Ajouter une feuille de route"
              onPress={handleSave}
              loading={isLoading}
              disabled={isLoading}
            />
          </View>
        </ScrollView>
      </Animated.View>

      {/* Time Picker Modal */}
      <CustomTimePicker
        visible={timePickerVisible}
        timeSlot={selectedTimeSlot?.timeSlot || "Matin"}
        selectedTime={
          selectedTimeSlot && slotTimes[selectedTimeSlot.id]
            ? slotTimes[selectedTimeSlot.id][
                timePickerType === "start" ? "start" : "end"
              ]
            : selectedTripId
            ? otherTrips.find((t) => t.id === selectedTripId)?.[
                timePickerType === "start" ? "startTime" : "endTime"
              ] || "09:00"
            : "09:00"
        }
        onTimeSelect={handleTimeSelect}
        onClose={() => setTimePickerVisible(false)}
        title={timePickerTitle}
      />
    </SafeAreaView>
  );
};
