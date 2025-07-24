// screens/innerApplication/planning/tripDetailsScreen.tsx
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Alert, Animated, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeContext";
import { Header } from "../../../shared/components/ui/Header";
import { usePlanningStore } from "../../../store/planningStore";
import { TripActionsSection } from "./components/TripActionsSection";
import { TripDetailsCard } from "./components/TripDetailsCard";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
});

export const TripDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { selectedTrip, isLoading, updateTripStatus, fetchTripDetails } =
    usePlanningStore();

  useEffect(() => {
    if (id && (!selectedTrip || selectedTrip.id !== id)) {
      fetchTripDetails(id);
    }
  }, [id, selectedTrip, fetchTripDetails]);

  useEffect(() => {
    if (selectedTrip) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedTrip, fadeAnim]);

  if (!selectedTrip) {
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

  const handleStartTrip = async () => {
    Alert.alert(
      "Démarrer le trajet",
      "Confirmez-vous le démarrage de ce trajet ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Démarrer",
          onPress: async () => {
            try {
              await updateTripStatus(selectedTrip.id, "en_cours");
              Alert.alert("Success", "Le trajet a été démarré.");
            } catch (error) {
              Alert.alert("Erreur", "Impossible de démarrer le trajet.");
            }
          },
        },
      ]
    );
  };

  const handleCompleteTrip = async () => {
    Alert.alert("Terminer le trajet", "Confirmez-vous la fin de ce trajet ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Terminer",
        onPress: async () => {
          try {
            await updateTripStatus(selectedTrip.id, "termine");
            Alert.alert("Success", "Le trajet a été terminé.");
          } catch (error) {
            Alert.alert("Erreur", "Impossible de terminer le trajet.");
          }
        },
      },
    ]);
  };

  const handleCancelTrip = async () => {
    Alert.alert(
      "Annuler le trajet",
      "Êtes-vous sûr de vouloir annuler ce trajet ?",
      [
        { text: "Non", style: "cancel" },
        {
          text: "Annuler le trajet",
          style: "destructive",
          onPress: async () => {
            try {
              await updateTripStatus(
                selectedTrip.id,
                "annule",
                "Annulé par le chauffeur"
              );
              Alert.alert("Success", "Le trajet a été annulé.");
            } catch (error) {
              Alert.alert("Erreur", "Impossible d'annuler le trajet.");
            }
          },
        },
      ]
    );
  };

  const dynamicStyles = {
    container: {
      ...styles.container,
      backgroundColor: colors.backgroundSecondary,
    },
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Header
        leftIcon={{
          icon: "chevron-left",
          onPress: () => router.back(),
        }}
        title="Détails du trajet"
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <TripDetailsCard trip={selectedTrip} />

          <TripActionsSection
            trip={selectedTrip}
            isLoading={isLoading}
            onStartTrip={handleStartTrip}
            onCompleteTrip={handleCompleteTrip}
            onCancelTrip={handleCancelTrip}
          />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};
