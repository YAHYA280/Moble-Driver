import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
import { Button } from "../../../../shared/components/ui/Button";
import { Input } from "../../../../shared/components/ui/Input";

interface TripData {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

interface OtherTripsSectionProps {
  trips: TripData[];
  onTripsChange: (trips: TripData[]) => void;
  onTimePress?: (tripId: string, field: "startTime" | "endTime") => void;
  style?: ViewStyle;
}

export const OtherTripsSection: React.FC<OtherTripsSectionProps> = ({
  trips,
  onTripsChange,
  onTimePress,
  style,
}) => {
  const colors = useThemeColors();
  const [isExpanded, setIsExpanded] = useState(false);
  const [rotateAnim] = useState(new Animated.Value(0));

  // Time picker state
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectedTimeField, setSelectedTimeField] = useState<
    "startTime" | "endTime"
  >("startTime");
  const [tempTime, setTempTime] = useState(new Date());

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;

    Animated.timing(rotateAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setIsExpanded(!isExpanded);
  };

  const addTrip = () => {
    const newTrip: TripData = {
      id: Date.now().toString(),
      name: "",
      startTime: "09:00",
      endTime: "12:00",
    };
    onTripsChange([...trips, newTrip]);
  };

  const updateTrip = (id: string, field: keyof TripData, value: string) => {
    const updatedTrips = trips.map((trip) =>
      trip.id === id ? { ...trip, [field]: value } : trip
    );
    onTripsChange(updatedTrips);
  };

  const removeTrip = (id: string) => {
    const updatedTrips = trips.filter((trip) => trip.id !== id);
    onTripsChange(updatedTrips);
  };

  const handleTimePress = (tripId: string, field: "startTime" | "endTime") => {
    const trip = trips.find((t) => t.id === tripId);
    if (trip) {
      setSelectedTripId(tripId);
      setSelectedTimeField(field);

      // Convert time string to Date object
      const [hours, minutes] = trip[field].split(":").map(Number);
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      setTempTime(date);

      setShowTimePicker(true);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);

      if (event.type === "set" && selectedTime && selectedTripId) {
        const hours = selectedTime.getHours().toString().padStart(2, "0");
        const minutes = selectedTime.getMinutes().toString().padStart(2, "0");
        const timeString = `${hours}:${minutes}`;

        // Validate time order
        const trip = trips.find((t) => t.id === selectedTripId);
        if (trip && validateTimeOrder(trip, selectedTimeField, timeString)) {
          updateTrip(selectedTripId, selectedTimeField, timeString);
        }
      }

      setSelectedTripId(null);
      setTempTime(new Date());
    } else {
      // iOS - just update the temp time, don't close yet
      if (selectedTime) {
        setTempTime(selectedTime);
      }
    }
  };

  const handleIOSConfirm = () => {
    if (selectedTripId) {
      const hours = tempTime.getHours().toString().padStart(2, "0");
      const minutes = tempTime.getMinutes().toString().padStart(2, "0");
      const timeString = `${hours}:${minutes}`;

      // Validate time order
      const trip = trips.find((t) => t.id === selectedTripId);
      if (trip && !validateTimeOrder(trip, selectedTimeField, timeString)) {
        return; // Don't update if validation fails
      }

      updateTrip(selectedTripId, selectedTimeField, timeString);
    }
    handleIOSCancel();
  };

  const validateTimeOrder = (
    trip: TripData,
    field: "startTime" | "endTime",
    newTime: string
  ) => {
    const newStartTime = field === "startTime" ? newTime : trip.startTime;
    const newEndTime = field === "endTime" ? newTime : trip.endTime;

    // Convert to minutes for comparison
    const [startHours, startMinutes] = newStartTime.split(":").map(Number);
    const [endHours, endMinutes] = newEndTime.split(":").map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    if (startTotalMinutes >= endTotalMinutes) {
      Alert.alert(
        "Erreur de validation",
        `L'heure de début (${newStartTime}) doit être antérieure à l'heure de fin (${newEndTime}).`,
        [{ text: "OK" }]
      );
      return false;
    }

    return true;
  };

  const handleIOSCancel = () => {
    setShowTimePicker(false);
    setSelectedTripId(null);
    setTempTime(new Date());
  };

  const renderTripItem = (trip: TripData) => (
    <View key={trip.id} style={styles.tripItem}>
      <View style={styles.tripHeader}>
        <Text style={[styles.tripTitle, { color: colors.text }]}>
          {trip.name || "Nouveau trajet"}
        </Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeTrip(trip.id)}
        >
          <FontAwesome name="times" size={16} color={colors.error} />
        </TouchableOpacity>
      </View>

      <Input
        value={trip.name}
        onChangeText={(value) => updateTrip(trip.id, "name", value)}
        placeholder="Nom du trajet (ex: Visite garage, Visite médicale...)"
        style={styles.tripNameInput}
      />

      <View style={styles.timeRow}>
        <View style={styles.timeContainer}>
          <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>
            Début {trip.name || "trajet"}
          </Text>
          <TouchableOpacity
            style={[
              styles.timeButton,
              {
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
              },
            ]}
            onPress={() => handleTimePress(trip.id, "startTime")}
          >
            <Text style={[styles.timeText, { color: colors.text }]}>
              {trip.startTime}
            </Text>
            <FontAwesome
              name="clock-o"
              size={16}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.timeContainer}>
          <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>
            Fin {trip.name || "trajet"}
          </Text>
          <TouchableOpacity
            style={[
              styles.timeButton,
              {
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
              },
            ]}
            onPress={() => handleTimePress(trip.id, "endTime")}
          >
            <Text style={[styles.timeText, { color: colors.text }]}>
              {trip.endTime}
            </Text>
            <FontAwesome
              name="clock-o"
              size={16}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 20,
      overflow: "hidden",
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: colors.isDark ? 0.3 : 0.08,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      backgroundColor: colors.backgroundTertiary,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerIcon: {
      marginRight: 8,
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary,
    },
    expandButton: {
      padding: 4,
    },
    content: {
      padding: 16,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 12,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 8,
      borderStyle: "dashed",
      marginBottom: 16,
    },
    addButtonText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "500",
      marginLeft: 8,
    },
    tripItem: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
    },
    tripHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    tripTitle: {
      fontSize: 16,
      fontWeight: "600",
    },
    removeButton: {
      padding: 4,
    },
    tripNameInput: {
      marginBottom: 12,
    },
    timeRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    timeContainer: {
      flex: 1,
      marginHorizontal: 4,
    },
    timeLabel: {
      fontSize: 12,
      marginBottom: 8,
      fontWeight: "500",
    },
    timeButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    timeText: {
      fontSize: 16,
      fontWeight: "500",
    },
    // iOS Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: Platform.OS === "ios" ? 34 : 20,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    modalActions: {
      flexDirection: "row",
      gap: 12,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.header} onPress={toggleExpanded}>
        <View style={styles.headerLeft}>
          <FontAwesome
            name="plus"
            size={16}
            color={colors.primary}
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Ajouter un autre trajet</Text>
        </View>
        <Animated.View
          style={[styles.expandButton, { transform: [{ rotate }] }]}
        >
          <FontAwesome
            name="chevron-down"
            size={16}
            color={colors.textSecondary}
          />
        </Animated.View>
      </TouchableOpacity>

      <ConditionalComponent isValid={isExpanded}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.addButton} onPress={addTrip}>
            <FontAwesome name="plus" size={16} color={colors.primary} />
            <Text style={styles.addButtonText}>Ajouter un trajet</Text>
          </TouchableOpacity>

          {trips.map(renderTripItem)}
        </View>
      </ConditionalComponent>

      {/* Native Time Picker */}
      {showTimePicker && Platform.OS === "android" && (
        <DateTimePicker
          value={tempTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* iOS Modal Time Picker */}
      {showTimePicker && Platform.OS === "ios" && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showTimePicker}
          onRequestClose={handleIOSCancel}
        >
          <TouchableWithoutFeedback onPress={handleIOSCancel}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Sélectionner l'heure</Text>
                  </View>

                  <DateTimePicker
                    value={tempTime}
                    mode="time"
                    is24Hour={true}
                    display="spinner"
                    onChange={handleTimeChange}
                    style={{
                      backgroundColor: colors.surface,
                      height: 200,
                    }}
                  />

                  <View style={styles.modalActions}>
                    <Button
                      title="Annuler"
                      variant="outline"
                      onPress={handleIOSCancel}
                      style={{ flex: 1 }}
                    />
                    <Button
                      title="Confirmer"
                      onPress={handleIOSConfirm}
                      style={{ flex: 1 }}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};
