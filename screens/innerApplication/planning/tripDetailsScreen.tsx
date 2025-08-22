// screens/innerApplication/planning/tripDetailsScreen.tsx
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef } from "react";
import { Animated, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { usePlanningStore } from "../../../store/planningStore";
import { ContactSection } from "./components/tripDetails/ContactSection";
import { RouteSection } from "./components/tripDetails/RouteSection";
import { StopsSection } from "./components/tripDetails/StopsSection";
import { TimeSection } from "./components/tripDetails/TimeSection";
import { VehicleSection } from "./components/tripDetails/VehicleSection";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
});

export const TripDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { selectedTrip, fetchTripDetails } = usePlanningStore();

  const trip = useMemo(() => {
    return selectedTrip;
  }, [selectedTrip?.id, selectedTrip?.updatedAt]);

  useEffect(() => {
    if (id && (!trip || trip.id !== id)) {
      fetchTripDetails(id);
    }
  }, [id]);

  useEffect(() => {
    if (trip && trip.id === id) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [trip?.id, id, fadeAnim]);

  const handleMapPress = () => {
    if (trip) {
      router.push(`/(tabs)/geolocation?tripId=${trip.id}`);
    }
  };

  const handleContactPress = (phoneNumber: string) => {
    // console.log(`Calling ${phoneNumber}`);
  };

  if (!trip || trip.id !== id) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colors.backgroundSecondary },
        ]}
      >
        <Header
          leftIcon={{
            icon: "chevron-left",
            onPress: () => router.back(),
          }}
          title="Chargement..."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
    >
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="On y va ?🚗"
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <RouteSection trip={trip} />
          <TimeSection trip={trip} />
          <ContactSection onContactPress={handleContactPress} />
          <StopsSection onMapPress={handleMapPress} />
          <VehicleSection trip={trip} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
