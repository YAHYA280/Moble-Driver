import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
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

export const RouteSheetEditScreen: React.FC = () => {
  const { colors } = useTheme();
  const { id, date, mode } = useLocalSearchParams<{
    id: string;
    date?: string;
    mode?: "create" | "view";
  }>();

  // Local state for form data
  const [dayData, setDayData] = useState<DayData | null>(null);
  const [originalDayData, setOriginalDayData] = useState<DayData | null>(null);
  const [startKm, setStartKm] = useState("");
  const [endKm, setEndKm] = useState("");
  const [fuelAmount, setFuelAmount] = useState("");
  const [observations, setObservations] = useState("");
  const [otherTrips, setOtherTrips] = useState<TripData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewMode, setIsViewMode] = useState(mode === "view");
  const [hasChanges, setHasChanges] = useState(false);

  // Simple change tracker - set to true whenever ANY action happens
  const [userMadeChanges, setUserMadeChanges] = useState(false);

  // Time picker state
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlotData | null>(
    null
  );
  const [timePickerType, setTimePickerType] = useState<"start" | "end">(
    "start"
  );
  const [timePickerTitle, setTimePickerTitle] = useState("");

  // Time management for each slot
  const [slotTimes, setSlotTimes] = useState<
    Record<string, { start: string; end: string }>
  >({});

  // Store original slot times for comparison
  const [originalSlotTimes, setOriginalSlotTimes] = useState<
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
        // Store original data for comparison
        const originalData = JSON.parse(JSON.stringify(foundDay));
        setOriginalDayData(originalData);

        // Initialize times for each slot
        const initialTimes: Record<string, { start: string; end: string }> = {};
        foundDay.timeSlots.forEach((slot) => {
          initialTimes[slot.id] = {
            start: getDefaultStartTime(slot.timeSlot),
            end: getDefaultEndTime(slot.timeSlot),
          };
        });
        setSlotTimes(initialTimes);
        // Store original times for comparison
        setOriginalSlotTimes(JSON.parse(JSON.stringify(initialTimes)));

        // Initialize form with existing data if any
        const activeSlots = foundDay.timeSlots.filter((slot) => slot.isActive);
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
  }, [currentRouteSheet, date, mode]);

  // Also track changes when form fields change
  const handleStartKmChange = (value: string) => {
    setStartKm(value);
    setUserMadeChanges(true);
    setHasChanges(true);
    console.log("🔥 START KM CHANGED");
  };

  const handleEndKmChange = (value: string) => {
    setEndKm(value);
    setUserMadeChanges(true);
    setHasChanges(true);
    console.log("🔥 END KM CHANGED");
  };

  const handleFuelAmountChange = (value: string) => {
    setFuelAmount(value);
    setUserMadeChanges(true);
    setHasChanges(true);
    console.log("🔥 FUEL CHANGED");
  };

  const handleObservationsChange = (value: string) => {
    setObservations(value);
    setUserMadeChanges(true);
    setHasChanges(true);
    console.log("🔥 OBSERVATIONS CHANGED");
  };

  const handleOtherTripsChange = (trips: TripData[]) => {
    setOtherTrips(trips);
    setUserMadeChanges(true);
    setHasChanges(true);
    console.log("🔥 OTHER TRIPS CHANGED");
  };

  const handleTimeSlotToggle = async (timeSlot: TimeSlotData) => {
    if (!dayData || !date) return;

    console.log("🔥 TIME SLOT TOGGLED - SETTING CHANGES TO TRUE");

    // IMMEDIATELY mark as changed when user clicks
    setUserMadeChanges(true);
    setHasChanges(true);

    // Immediately update local state - this ensures change detection works
    const updatedTimeSlots = dayData.timeSlots.map((slot) =>
      slot.id === timeSlot.id ? { ...slot, isActive: !slot.isActive } : slot
    );

    const updatedDayData = { ...dayData, timeSlots: updatedTimeSlots };
    setDayData(updatedDayData);

    // Optional: Update store in background (don't await to avoid blocking UI)
    updateTimeSlotData(date, timeSlot.timeSlot, {
      isActive: !timeSlot.isActive,
    }).catch((error) => {
      console.log("Store update error:", error);
      // Optionally revert local state if store update fails
    });
  };

  const handleTimePress = (timeSlot: TimeSlotData, type: "start" | "end") => {
    // Allow time editing in both create and view mode
    setSelectedTimeSlot(timeSlot);
    setTimePickerType(type);
    setTimePickerTitle(
      `${type === "start" ? "Début" : "Fin"} - ${timeSlot.timeSlot}`
    );
    setTimePickerVisible(true);
  };

  const handleTimeSelect = (selectedTime: string) => {
    if (selectedTimeSlot) {
      console.log("🔥 TIME CHANGED - SETTING CHANGES TO TRUE");

      // IMMEDIATELY mark as changed when user changes time
      setUserMadeChanges(true);
      setHasChanges(true);

      // Validate time order for time slots
      const currentTimes = slotTimes[selectedTimeSlot.id] || {
        start: getDefaultStartTime(selectedTimeSlot.timeSlot),
        end: getDefaultEndTime(selectedTimeSlot.timeSlot),
      };

      const newStartTime =
        timePickerType === "start" ? selectedTime : currentTimes.start;
      const newEndTime =
        timePickerType === "end" ? selectedTime : currentTimes.end;

      if (!validateTimeSlotOrder(newStartTime, newEndTime)) {
        return; // Don't update if validation fails
      }

      // Update slot times - this will trigger the hasChanges detection
      setSlotTimes((prev) => ({
        ...prev,
        [selectedTimeSlot.id]: {
          ...prev[selectedTimeSlot.id],
          [timePickerType === "start" ? "start" : "end"]: selectedTime,
        },
      }));
    }
  };

  const validateTimeSlotOrder = (startTime: string, endTime: string) => {
    // Convert to minutes for comparison
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    if (startTotalMinutes >= endTotalMinutes) {
      Alert.alert(
        "Erreur de validation",
        `L'heure de début (${startTime}) doit être antérieure à l'heure de fin (${endTime}).`,
        [{ text: "OK" }]
      );
      return false;
    }

    return true;
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

      // Update the first active slot with data and apply time slot changes
      const updatedTimeSlots = dayData.timeSlots.map((slot) => {
        if (slot.isActive && slot.id === activeSlots[0].id) {
          return {
            ...slot,
            kilometrage: {
              startKm: startKmNum,
              endKm: endKmNum,
            },
            comments:
              observations + (isViewMode && hasChanges ? " [Modifié]" : ""),
            otherTrips: otherTrips.length > 0 ? JSON.stringify(otherTrips) : "",
            isCompleted: true,
          };
        }
        return slot;
      });

      // Mark as modified when changes are applied in view mode
      const updatedDayData: DayData = {
        ...dayData,
        timeSlots: updatedTimeSlots,
        isCompleted: true,
      };

      // Add modification flag for view mode changes
      if (isViewMode && hasChanges) {
        (updatedDayData as any).isModified = true;
      }

      await saveDayData(date, updatedDayData);

      const successMessage =
        isViewMode && hasChanges
          ? "Modifications appliquées avec succès."
          : "Feuille de route sauvegardée avec succès.";

      Alert.alert("Succès", successMessage, [
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

  const getButtonText = () => {
    if (isViewMode) {
      return hasChanges
        ? "Appliquer les modifications"
        : "Voir la feuille de route";
    } else {
      return "Ajouter une feuille de route";
    }
  };

  const getHeaderTitle = () => {
    if (isViewMode) {
      return "Consultation feuille de route";
    } else {
      return "Ajout de feuille de route de chaque mois";
    }
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
    modifiedButton: {
      backgroundColor: colors.primary,
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
          title={getHeaderTitle()}
        />
      </Animated.View>

      {/* Content with KeyboardAvoidingView */}
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
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
            keyboardShouldPersistTaps="handled"
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
                disabled={false}
              />
            ))}

            {/* Kilometrage Section */}
            <KilometrageSection
              startKm={startKm}
              endKm={endKm}
              fuelAmount={fuelAmount}
              onStartKmChange={handleStartKmChange}
              onEndKmChange={handleEndKmChange}
              onFuelAmountChange={handleFuelAmountChange}
            />

            {/* Other Trips Section */}
            <OtherTripsSection
              trips={otherTrips}
              onTripsChange={handleOtherTripsChange}
            />

            {/* Observations Section */}
            <ObservationsSection
              observations={observations}
              onObservationsChange={handleObservationsChange}
            />

            {/* Save Button - Show when user made ANY changes */}
            {(userMadeChanges || hasChanges || !isViewMode) && (
              <View style={styles.saveButtonContainer}>
                <Button
                  title={getButtonText()}
                  onPress={handleSave}
                  loading={isLoading}
                  disabled={isLoading}
                  style={
                    (hasChanges || userMadeChanges) && isViewMode
                      ? styles.modifiedButton
                      : undefined
                  }
                />
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Time Picker Modal - Available in both create and view mode */}
      <CustomTimePicker
        visible={timePickerVisible}
        timeSlot={selectedTimeSlot?.timeSlot || "Matin"}
        selectedTime={
          selectedTimeSlot && slotTimes[selectedTimeSlot.id]
            ? slotTimes[selectedTimeSlot.id][
                timePickerType === "start" ? "start" : "end"
              ]
            : "09:00"
        }
        onTimeSelect={handleTimeSelect}
        onClose={() => setTimePickerVisible(false)}
        title={timePickerTitle}
      />
    </SafeAreaView>
  );
};
