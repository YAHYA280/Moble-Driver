import ConditionalComponent from "@/shared/components/conditionalComponent/conditionalComponent";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useThemeColors } from "../../../../hooks/useTheme";
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
    if (onTimePress) {
      onTimePress(tripId, field);
    }
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
    </View>
  );
};
